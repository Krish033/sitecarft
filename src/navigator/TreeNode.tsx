import React, { useCallback } from 'react';
import { useDocumentStore, useEditorStore } from '../state/context';
import { CONTAINER_TYPES } from '../types/document';
import { getNodeTypeIcon, AlertCircleIcon } from '../components/Icons';

// ─── TreeNode Props ──────────────────────────────────────────────────────────

interface TreeNodeProps {
  nodeId: string;
  depth: number;
}

// ─── TreeNode ────────────────────────────────────────────────────────────────

export function TreeNode({ nodeId, depth }: TreeNodeProps) {
  const node = useDocumentStore((s) => s.document.nodes[nodeId]);
  const selectedNodeId = useEditorStore((s) => s.selectedNodeId);
  const selectNode = useEditorStore((s) => s.selectNode);

  const isSelected = selectedNodeId === nodeId;
  const isContainer = node ? CONTAINER_TYPES.includes(node.type) : false;

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      selectNode(nodeId);
    },
    [nodeId, selectNode]
  );

  if (!node) {
    return (
      <div className="rsb-tree-node rsb-tree-node--error" style={{ paddingLeft: depth * 16 }}>
        <AlertCircleIcon size={14} />
        <span className="rsb-tree-node__label">Missing: {nodeId.slice(0, 8)}</span>
      </div>
    );
  }

  const label =
    (node.props.label as string) ||
    (node.props.text as string)?.slice(0, 24) ||
    node.type.charAt(0).toUpperCase() + node.type.slice(1);

  return (
    <>
      <div
        className={`rsb-tree-node ${isSelected ? 'rsb-tree-node--selected' : ''}`}
        style={{ paddingLeft: 12 + depth * 16 }}
        onClick={handleClick}
      >
        {isContainer && node.children.length > 0 && (
          <span className="rsb-tree-node__arrow">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        )}
        {isContainer && node.children.length === 0 && (
          <span className="rsb-tree-node__arrow rsb-tree-node__arrow--empty">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </span>
        )}
        {!isContainer && (
          <span className="rsb-tree-node__arrow rsb-tree-node__arrow--leaf" />
        )}
        <span className="rsb-tree-node__icon">
          {getNodeTypeIcon(node.type, 14)}
        </span>
        <span className="rsb-tree-node__label">{label}</span>
      </div>

      {/* Render children */}
      {isContainer &&
        node.children.map((childId) => (
          <TreeNode key={childId} nodeId={childId} depth={depth + 1} />
        ))}
    </>

  );
}
