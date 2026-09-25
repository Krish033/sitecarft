import React from 'react';
import { useDocumentStore } from '../state/context';
import { TreeNode } from './TreeNode';

// ─── Navigator ───────────────────────────────────────────────────────────────

export function Navigator() {
  const rootId = useDocumentStore((s) => s.document.root);

  return (
    <div className="rsb-navigator">
      <div className="rsb-navigator__header">
        <span className="rsb-navigator__title">Layers</span>
      </div>
      <div className="rsb-navigator__tree">
        <TreeNode nodeId={rootId} depth={0} />
      </div>
    </div>
  );
}
