import React, { useCallback, useMemo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CONTAINER_TYPES } from '../types/document';
import { useDocumentStore, useEditorStore } from '../state/context';
import { resolveStyles } from '../renderer/style-resolver';
import { getAnimationStyle, getScrollAnimationAttrs } from '../renderer/animations';
import { getComponentForType, UnknownComponent } from '../components/registry';

// ─── Props ───────────────────────────────────────────────────────────────────

interface CanvasNodeProps {
  nodeId: string;
}

// ─── CanvasNode ──────────────────────────────────────────────────────────────

/**
 * Wrapper around each node in the editor canvas.
 * Handles: selection, hover, drag/drop (sortable), and rendering the component.
 */
export function CanvasNode({ nodeId }: CanvasNodeProps) {
  const node = useDocumentStore((s) => s.document.nodes[nodeId]);
  const viewport = useEditorStore((s) => s.viewport);
  const selectedNodeId = useEditorStore((s) => s.selectedNodeId);
  const hoveredNodeId = useEditorStore((s) => s.hoveredNodeId);
  const selectNode = useEditorStore((s) => s.selectNode);
  const hoverNode = useEditorStore((s) => s.hoverNode);
  const updateNodeProps = useDocumentStore((s) => s.updateNodeProps);

  const isSelected = selectedNodeId === nodeId;
  const isHovered = hoveredNodeId === nodeId;
  const isContainer = node ? CONTAINER_TYPES.includes(node.type) : false;

  // dnd-kit sortable
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: nodeId,
    data: {
      source: 'canvas',
      nodeId,
      type: node?.type,
      isContainer,
    },
  });

  const sortableStyle: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  // Resolve styles
  const resolved = useMemo(
    () => resolveStyles(node?.styles, viewport),
    [node?.styles, viewport]
  );

  const animationStyles = useMemo(
    () => getAnimationStyle(node?.animation),
    [node?.animation]
  );

  const scrollAttrs = useMemo(
    () => getScrollAnimationAttrs(node?.animation),
    [node?.animation]
  );

  // Event handlers
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      selectNode(nodeId);
    },
    [nodeId, selectNode]
  );

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      hoverNode(nodeId);
    },
    [nodeId, hoverNode]
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      hoverNode(null);
    },
    [hoverNode]
  );

  const handleUpdateProps = useCallback(
    (props: Record<string, unknown>) => {
      updateNodeProps(nodeId, props);
    },
    [nodeId, updateNodeProps]
  );

  // ── Guard ──────────────────────────────────────────────────────────────
  if (!node) {
    return (
      <div className="rsb-node-error" ref={setNodeRef}>
        Missing node: <code>{nodeId}</code>
      </div>
    );
  }

  // ── Look up component ─────────────────────────────────────────────────
  const Component = getComponentForType(node.type);

  if (!Component) {
    return (
      <div ref={setNodeRef} style={sortableStyle} {...attributes}>
        <UnknownComponent
          node={node}
          resolvedStyles={resolved}
          isEditor={true}
        />
      </div>
    );
  }

  // ── Render children ───────────────────────────────────────────────────
  const childElements = isContainer
    ? node.children
        .filter(Boolean)
        .map((childId) => <CanvasNode key={childId} nodeId={childId} />)
    : undefined;

  // ── Build class name ──────────────────────────────────────────────────
  let wrapperClass = 'rsb-canvas-node';
  if (isSelected) wrapperClass += ' rsb-canvas-node--selected';
  if (isHovered && !isSelected) wrapperClass += ' rsb-canvas-node--hovered';
  if (isDragging) wrapperClass += ' rsb-canvas-node--dragging';

  // ── Node label ────────────────────────────────────────────────────────
  const label =
    (node.props.label as string) ||
    node.type.charAt(0).toUpperCase() + node.type.slice(1);

  // ── Custom CSS injection ──────────────────────────────────────────────
  const customCssElement = node.customCss ? (
    <style>
      {node.customCss.replace(/:self/g, `[data-node-id="${nodeId}"]`)}
    </style>
  ) : null;

  return (
    <div
      ref={setNodeRef}
      className={wrapperClass}
      data-node-id={nodeId}
      data-node-type={node.type}
      style={sortableStyle}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...attributes}
      {...listeners}
      {...scrollAttrs}
    >
      {/* Selection label */}
      {isSelected && (
        <div className="rsb-canvas-node__label">{label}</div>
      )}

      {customCssElement}

      <Component
        node={node}
        resolvedStyles={{ ...resolved, ...animationStyles }}
        isEditor={true}
        onUpdateProps={handleUpdateProps}
      >
        {childElements}
      </Component>
    </div>
  );
}
