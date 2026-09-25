import React from 'react';
import type { StyleProperties } from '../types/document';
import { useDocumentStore, useEditorStore } from '../state/context';
import { getResolvedStyleValue } from '../renderer/style-resolver';
import { InspectorField } from './ContentSection';

// ─── LayoutSection ───────────────────────────────────────────────────────────

export function LayoutSection() {
  const selectedId = useEditorStore((s) => s.selectedNodeId);
  const viewport = useEditorStore((s) => s.viewport);
  const node = useDocumentStore((s) =>
    selectedId ? s.document.nodes[selectedId] : null
  );

  const updateNodeStyles = useDocumentStore((s) => s.updateNodeStyles);

  if (!node || !selectedId) return null;

  const handleChange = (prop: keyof StyleProperties, value: string | number) => {
    updateNodeStyles(selectedId, viewport, {
      [prop]: value || undefined,
    } as Partial<StyleProperties>);
  };

  const getValue = (prop: keyof StyleProperties): string => {
    const val = getResolvedStyleValue(node.styles, viewport, prop);
    return val !== undefined ? String(val) : '';
  };

  const position = getValue('position') || 'static';

  return (
    <div className="rsb-inspector-section">
      <h3 className="rsb-inspector-section__title">
        Layout
        <span className="rsb-inspector-section__viewport-badge">
          {viewport}
        </span>
      </h3>

      <InspectorField label="Display">
        <select
          className="rsb-select"
          value={getValue('display') || ''}
          onChange={(e) => handleChange('display', e.target.value)}
        >
          <option value="">Default</option>
          <option value="block">Block</option>
          <option value="flex">Flex</option>
          <option value="grid">Grid</option>
          <option value="inline">Inline</option>
          <option value="inline-block">Inline Block</option>
          <option value="inline-flex">Inline Flex</option>
          <option value="none">None</option>
        </select>
      </InspectorField>

      {/* Flex properties */}
      {(getValue('display') === 'flex' ||
        getValue('display') === 'inline-flex') && (
        <>
          <InspectorField label="Direction">
            <select
              className="rsb-select"
              value={getValue('flexDirection') || 'row'}
              onChange={(e) => handleChange('flexDirection', e.target.value)}
            >
              <option value="row">Row</option>
              <option value="column">Column</option>
              <option value="row-reverse">Row Reverse</option>
              <option value="column-reverse">Column Reverse</option>
            </select>
          </InspectorField>

          <InspectorField label="Wrap">
            <select
              className="rsb-select"
              value={getValue('flexWrap') || 'nowrap'}
              onChange={(e) => handleChange('flexWrap', e.target.value)}
            >
              <option value="nowrap">No Wrap</option>
              <option value="wrap">Wrap</option>
              <option value="wrap-reverse">Wrap Reverse</option>
            </select>
          </InspectorField>

          <InspectorField label="Justify">
            <select
              className="rsb-select"
              value={getValue('justifyContent') || ''}
              onChange={(e) => handleChange('justifyContent', e.target.value)}
            >
              <option value="">Default</option>
              <option value="flex-start">Start</option>
              <option value="center">Center</option>
              <option value="flex-end">End</option>
              <option value="space-between">Space Between</option>
              <option value="space-around">Space Around</option>
              <option value="space-evenly">Space Evenly</option>
            </select>
          </InspectorField>

          <InspectorField label="Align Items">
            <select
              className="rsb-select"
              value={getValue('alignItems') || ''}
              onChange={(e) => handleChange('alignItems', e.target.value)}
            >
              <option value="">Default</option>
              <option value="flex-start">Start</option>
              <option value="center">Center</option>
              <option value="flex-end">End</option>
              <option value="stretch">Stretch</option>
              <option value="baseline">Baseline</option>
            </select>
          </InspectorField>
        </>
      )}

      <InspectorField label="Position">
        <select
          className="rsb-select"
          value={position}
          onChange={(e) => handleChange('position', e.target.value)}
        >
          <option value="static">Static</option>
          <option value="relative">Relative</option>
          <option value="absolute">Absolute</option>
        </select>
      </InspectorField>

      {/* Position offsets for absolute/relative */}
      {(position === 'absolute' || position === 'relative') && (
        <div className="rsb-position-grid">
          <InspectorField label="Top">
            <input
              type="text"
              className="rsb-input rsb-input--small"
              value={getValue('top')}
              onChange={(e) => handleChange('top', e.target.value)}
              placeholder="auto"
            />
          </InspectorField>
          <InspectorField label="Right">
            <input
              type="text"
              className="rsb-input rsb-input--small"
              value={getValue('right')}
              onChange={(e) => handleChange('right', e.target.value)}
              placeholder="auto"
            />
          </InspectorField>
          <InspectorField label="Bottom">
            <input
              type="text"
              className="rsb-input rsb-input--small"
              value={getValue('bottom')}
              onChange={(e) => handleChange('bottom', e.target.value)}
              placeholder="auto"
            />
          </InspectorField>
          <InspectorField label="Left">
            <input
              type="text"
              className="rsb-input rsb-input--small"
              value={getValue('left')}
              onChange={(e) => handleChange('left', e.target.value)}
              placeholder="auto"
            />
          </InspectorField>
          <InspectorField label="Z-Index">
            <input
              type="number"
              className="rsb-input rsb-input--small"
              value={getValue('zIndex')}
              onChange={(e) => handleChange('zIndex', Number(e.target.value))}
              placeholder="auto"
            />
          </InspectorField>
        </div>
      )}

      {/* Sizing */}
      <InspectorField label="Width">
        <input
          type="text"
          className="rsb-input"
          value={getValue('width')}
          onChange={(e) => handleChange('width', e.target.value)}
          placeholder="auto"
        />
      </InspectorField>

      <InspectorField label="Height">
        <input
          type="text"
          className="rsb-input"
          value={getValue('height')}
          onChange={(e) => handleChange('height', e.target.value)}
          placeholder="auto"
        />
      </InspectorField>

      <InspectorField label="Min Width">
        <input
          type="text"
          className="rsb-input"
          value={getValue('minWidth')}
          onChange={(e) => handleChange('minWidth', e.target.value)}
          placeholder="0"
        />
      </InspectorField>

      <InspectorField label="Max Width">
        <input
          type="text"
          className="rsb-input"
          value={getValue('maxWidth')}
          onChange={(e) => handleChange('maxWidth', e.target.value)}
          placeholder="none"
        />
      </InspectorField>

      <InspectorField label="Min Height">
        <input
          type="text"
          className="rsb-input"
          value={getValue('minHeight')}
          onChange={(e) => handleChange('minHeight', e.target.value)}
          placeholder="0"
        />
      </InspectorField>

      <InspectorField label="Max Height">
        <input
          type="text"
          className="rsb-input"
          value={getValue('maxHeight')}
          onChange={(e) => handleChange('maxHeight', e.target.value)}
          placeholder="none"
        />
      </InspectorField>

      <InspectorField label="Flex">
        <input
          type="text"
          className="rsb-input"
          value={getValue('flex')}
          onChange={(e) => handleChange('flex', e.target.value)}
          placeholder="auto"
        />
      </InspectorField>
    </div>
  );
}
