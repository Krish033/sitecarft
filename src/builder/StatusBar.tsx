import React from 'react';
import { useDocumentStore, useEditorStore } from '../state/context';
import { VIEWPORT_LABELS } from '../renderer/style-resolver';

import { DocumentIcon, CheckCircleIcon, ClockIcon } from '../components/Icons';

// ─── StatusBar ───────────────────────────────────────────────────────────────

export function StatusBar() {
  const nodeCount = useDocumentStore(
    (s) => Object.keys(s.document.nodes).length
  );
  const status = useDocumentStore(
    (s) => s.document.metadata?.status || 'draft'
  );
  const viewport = useEditorStore((s) => s.viewport);
  const selectedNodeId = useEditorStore((s) => s.selectedNodeId);
  const selectedNode = useDocumentStore((s) =>
    selectedNodeId ? s.document.nodes[selectedNodeId] : null
  );

  return (
    <div className="rsb-status-bar">
      <div className="rsb-status-bar__left">
        <span
          className={`rsb-status-bar__status rsb-status-bar__status--${status}`}
        >
          {status === 'published' ? (
            <>
              <CheckCircleIcon size={13} />
              <span>Published</span>
            </>
          ) : (
            <>
              <ClockIcon size={13} />
              <span>Draft</span>
            </>
          )}
        </span>
      </div>


      <div className="rsb-status-bar__center">
        {selectedNode && (
          <span className="rsb-status-bar__item">
            Selected: {selectedNode.type}{' '}
            <code>{selectedNodeId?.slice(0, 8)}</code>
          </span>
        )}
      </div>

      <div className="rsb-status-bar__right">
        <span className="rsb-status-bar__item">
          {VIEWPORT_LABELS[viewport]}
        </span>
        <span className="rsb-status-bar__separator">|</span>
        <span className="rsb-status-bar__item">{nodeCount} nodes</span>
      </div>
    </div>
  );
}
