import React, { useCallback, useMemo } from 'react';
import { CONTAINER_TYPES } from '../types/document';
import { useDocumentStore, useEditorStore } from '../state/context';
import { resolveStyles } from './style-resolver';
import { getAnimationStyle, getScrollAnimationAttrs } from './animations';
import { getComponentForType, UnknownComponent } from '../components/registry';

// ─── Props ───────────────────────────────────────────────────────────────────

interface NodeRendererProps {
  nodeId: string;
  isEditor?: boolean;
}

// ─── NodeRenderer ────────────────────────────────────────────────────────────

/**
 * Central recursive renderer.
 * 1. Retrieves the node from the store
 * 2. Resolves responsive styles for the active viewport
 * 3. Looks up the component from the registry
 * 4. Renders children recursively (for containers)
 * 5. Applies animations
 *
 * Used both in the editor canvas and in preview mode.
 */
export function NodeRenderer({ nodeId, isEditor = false }: NodeRendererProps) {
  const node = useDocumentStore((s) => s.document.nodes[nodeId]);
  const viewport = useEditorStore((s) => s.viewport);
  const updateNodeProps = useDocumentStore((s) => s.updateNodeProps);

  // Resolve styles for the active viewport
  const resolved = useMemo(
    () => resolveStyles(node?.styles, viewport),
    [node?.styles, viewport]
  );

  // Animation styles
  const animationStyles = useMemo(
    () => getAnimationStyle(node?.animation),
    [node?.animation]
  );

  // Scroll animation data attributes
  const scrollAttrs = useMemo(
    () => getScrollAnimationAttrs(node?.animation),
    [node?.animation]
  );

  // Prop update handler for inline editing
  const handleUpdateProps = useCallback(
    (props: Record<string, unknown>) => {
      updateNodeProps(nodeId, props);
    },
    [nodeId, updateNodeProps]
  );

  // ── Guard: Missing Node ────────────────────────────────────────────────
  if (!node) {
    if (isEditor) {
      return (
        <div className="rsb-node-error">
          Missing node: <code>{nodeId}</code>
        </div>
      );
    }
    return null;
  }

  // ── Inject Custom CSS ─────────────────────────────────────────────────
  const customCssElement = node.customCss ? (
    <style>{node.customCss.replace(/:self/g, `[data-node-id="${nodeId}"]`)}</style>
  ) : null;

  // ── Render Page Root ──────────────────────────────────────────────────
  if (node.type === 'page') {
    const childElements = (node.children || [])
      .filter((childId) => childId)
      .map((childId) => (
        <NodeRenderer key={childId} nodeId={childId} isEditor={isEditor} />
      ));

    return (
      <div
        className="rsb-page"
        data-node-id={nodeId}
        style={{
          minHeight: '100%',
          backgroundColor: '#ffffff',
          ...resolved,
        }}
        {...scrollAttrs}
      >
        {customCssElement}
        {childElements}
      </div>
    );
  }

  // ── Look Up Component ──────────────────────────────────────────────────
  const Component = getComponentForType(node.type);

  if (!Component) {
    return (
      <UnknownComponent
        node={node}
        resolvedStyles={resolved}
        isEditor={isEditor}
      />
    );
  }

  // ── Render Children (for containers) ───────────────────────────────────
  const isContainer = CONTAINER_TYPES.includes(node.type);
  const childElements = isContainer
    ? node.children
        .filter((childId) => childId) // Skip any falsy refs
        .map((childId) => (
          <NodeRenderer key={childId} nodeId={childId} isEditor={isEditor} />
        ))
    : undefined;

  // ── Combine Styles ────────────────────────────────────────────────────
  const combinedStyles: React.CSSProperties = {
    ...resolved,
    ...animationStyles,
  };

  return (
    <div data-node-id={nodeId} {...scrollAttrs}>
      {customCssElement}
      <Component
        node={node}
        resolvedStyles={combinedStyles}
        isEditor={isEditor}
        onUpdateProps={handleUpdateProps}
      >
        {childElements}
      </Component>
    </div>
  );
}
