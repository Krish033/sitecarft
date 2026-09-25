import React from 'react';
import { useDocumentStore, useEditorStore } from '../state/context';
import { InspectorField } from './ContentSection';

// ─── AdvancedSection ─────────────────────────────────────────────────────────

export function AdvancedSection() {
  const selectedId = useEditorStore((s) => s.selectedNodeId);
  const node = useDocumentStore((s) =>
    selectedId ? s.document.nodes[selectedId] : null
  );

  const updateNodeCustomCss = useDocumentStore((s) => s.updateNodeCustomCss);

  if (!node || !selectedId) return null;

  return (
    <div className="rsb-inspector-section">
      <h3 className="rsb-inspector-section__title">Advanced</h3>

      <InspectorField label="Node ID">
        <code className="rsb-code-display">{node.id}</code>
      </InspectorField>

      <InspectorField label="Node Type">
        <code className="rsb-code-display">{node.type}</code>
      </InspectorField>

      <InspectorField label="Custom CSS">
        <textarea
          className="rsb-textarea rsb-textarea--code"
          value={node.customCss || ''}
          onChange={(e) => updateNodeCustomCss(selectedId, e.target.value)}
          rows={6}
          spellCheck={false}
          placeholder={`:self {\n  /* Custom styles */\n}`}
        />
        <span className="rsb-inspector-hint">
          Use <code>:self</code> to target this element
        </span>
      </InspectorField>
    </div>
  );
}
