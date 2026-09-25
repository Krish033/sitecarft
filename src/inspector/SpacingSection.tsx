import React from 'react';
import type { StyleProperties } from '../types/document';
import { useDocumentStore, useEditorStore } from '../state/context';
import { getResolvedStyleValue } from '../renderer/style-resolver';
import { InspectorField } from './ContentSection';

// ─── SpacingSection ──────────────────────────────────────────────────────────

export function SpacingSection() {
  const selectedId = useEditorStore((s) => s.selectedNodeId);
  const viewport = useEditorStore((s) => s.viewport);
  const node = useDocumentStore((s) =>
    selectedId ? s.document.nodes[selectedId] : null
  );

  const updateNodeStyles = useDocumentStore((s) => s.updateNodeStyles);

  if (!node || !selectedId) return null;

  const handleChange = (prop: keyof StyleProperties, value: string) => {
    updateNodeStyles(selectedId, viewport, {
      [prop]: value || undefined,
    });
  };

  const getValue = (prop: keyof StyleProperties): string => {
    return (
      (getResolvedStyleValue(node.styles, viewport, prop) as string) || ''
    );
  };

  return (
    <div className="rsb-inspector-section">
      <h3 className="rsb-inspector-section__title">
        Spacing
        <span className="rsb-inspector-section__viewport-badge">
          {viewport}
        </span>
      </h3>

      {/* Margin */}
      <div className="rsb-spacing-box">
        <span className="rsb-spacing-box__label">Margin</span>
        <div className="rsb-spacing-box__grid">
          <input
            type="text"
            className="rsb-input rsb-input--tiny"
            value={getValue('marginTop')}
            onChange={(e) => handleChange('marginTop', e.target.value)}
            placeholder="0"
            title="Margin Top"
          />
          <input
            type="text"
            className="rsb-input rsb-input--tiny"
            value={getValue('marginRight')}
            onChange={(e) => handleChange('marginRight', e.target.value)}
            placeholder="0"
            title="Margin Right"
          />
          <input
            type="text"
            className="rsb-input rsb-input--tiny"
            value={getValue('marginBottom')}
            onChange={(e) => handleChange('marginBottom', e.target.value)}
            placeholder="0"
            title="Margin Bottom"
          />
          <input
            type="text"
            className="rsb-input rsb-input--tiny"
            value={getValue('marginLeft')}
            onChange={(e) => handleChange('marginLeft', e.target.value)}
            placeholder="0"
            title="Margin Left"
          />
        </div>
        <div className="rsb-spacing-box__labels">
          <span>T</span>
          <span>R</span>
          <span>B</span>
          <span>L</span>
        </div>
      </div>

      {/* Shorthand margin */}
      <InspectorField label="Margin (shorthand)">
        <input
          type="text"
          className="rsb-input"
          value={getValue('margin')}
          onChange={(e) => handleChange('margin', e.target.value)}
          placeholder="0px"
        />
      </InspectorField>

      {/* Padding */}
      <div className="rsb-spacing-box">
        <span className="rsb-spacing-box__label">Padding</span>
        <div className="rsb-spacing-box__grid">
          <input
            type="text"
            className="rsb-input rsb-input--tiny"
            value={getValue('paddingTop')}
            onChange={(e) => handleChange('paddingTop', e.target.value)}
            placeholder="0"
            title="Padding Top"
          />
          <input
            type="text"
            className="rsb-input rsb-input--tiny"
            value={getValue('paddingRight')}
            onChange={(e) => handleChange('paddingRight', e.target.value)}
            placeholder="0"
            title="Padding Right"
          />
          <input
            type="text"
            className="rsb-input rsb-input--tiny"
            value={getValue('paddingBottom')}
            onChange={(e) => handleChange('paddingBottom', e.target.value)}
            placeholder="0"
            title="Padding Bottom"
          />
          <input
            type="text"
            className="rsb-input rsb-input--tiny"
            value={getValue('paddingLeft')}
            onChange={(e) => handleChange('paddingLeft', e.target.value)}
            placeholder="0"
            title="Padding Left"
          />
        </div>
        <div className="rsb-spacing-box__labels">
          <span>T</span>
          <span>R</span>
          <span>B</span>
          <span>L</span>
        </div>
      </div>

      {/* Shorthand padding */}
      <InspectorField label="Padding (shorthand)">
        <input
          type="text"
          className="rsb-input"
          value={getValue('padding')}
          onChange={(e) => handleChange('padding', e.target.value)}
          placeholder="0px"
        />
      </InspectorField>

      {/* Gap */}
      <InspectorField label="Gap">
        <input
          type="text"
          className="rsb-input"
          value={getValue('gap')}
          onChange={(e) => handleChange('gap', e.target.value)}
          placeholder="0px"
        />
      </InspectorField>
    </div>
  );
}
