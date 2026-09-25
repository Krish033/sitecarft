import React, { useCallback } from 'react';
import type { StyleProperties } from '../types/document';
import { useDocumentStore, useEditorStore } from '../state/context';
import { getResolvedStyleValue } from '../renderer/style-resolver';
import { InspectorField } from './ContentSection';

// ─── StyleSection ────────────────────────────────────────────────────────────

export function StyleSection() {
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
        Style
        <span className="rsb-inspector-section__viewport-badge">
          {viewport}
        </span>
      </h3>

      <InspectorField label="Background">
        <div className="rsb-color-field">
          <input
            type="color"
            className="rsb-color-input"
            value={getValue('backgroundColor') || '#ffffff'}
            onChange={(e) => handleChange('backgroundColor', e.target.value)}
          />
          <input
            type="text"
            className="rsb-input rsb-input--small"
            value={getValue('backgroundColor')}
            onChange={(e) => handleChange('backgroundColor', e.target.value)}
            placeholder="transparent"
          />
        </div>
      </InspectorField>

      <InspectorField label="Text Color">
        <div className="rsb-color-field">
          <input
            type="color"
            className="rsb-color-input"
            value={getValue('color') || '#000000'}
            onChange={(e) => handleChange('color', e.target.value)}
          />
          <input
            type="text"
            className="rsb-input rsb-input--small"
            value={getValue('color')}
            onChange={(e) => handleChange('color', e.target.value)}
            placeholder="inherit"
          />
        </div>
      </InspectorField>

      <InspectorField label="Border">
        <input
          type="text"
          className="rsb-input"
          value={getValue('border')}
          onChange={(e) => handleChange('border', e.target.value)}
          placeholder="1px solid #ccc"
        />
      </InspectorField>

      <InspectorField label="Border Radius">
        <input
          type="text"
          className="rsb-input"
          value={getValue('borderRadius')}
          onChange={(e) => handleChange('borderRadius', e.target.value)}
          placeholder="0px"
        />
      </InspectorField>

      <InspectorField label="Box Shadow">
        <input
          type="text"
          className="rsb-input"
          value={getValue('boxShadow')}
          onChange={(e) => handleChange('boxShadow', e.target.value)}
          placeholder="none"
        />
      </InspectorField>

      <InspectorField label="Opacity">
        <input
          type="range"
          className="rsb-range"
          min="0"
          max="1"
          step="0.05"
          value={getValue('opacity') || '1'}
          onChange={(e) => handleChange('opacity', e.target.value)}
        />
        <span className="rsb-range-value">
          {getValue('opacity') || '1'}
        </span>
      </InspectorField>

      <InspectorField label="Overflow">
        <select
          className="rsb-select"
          value={getValue('overflow') || ''}
          onChange={(e) => handleChange('overflow', e.target.value)}
        >
          <option value="">Auto</option>
          <option value="visible">Visible</option>
          <option value="hidden">Hidden</option>
          <option value="scroll">Scroll</option>
        </select>
      </InspectorField>
    </div>
  );
}
