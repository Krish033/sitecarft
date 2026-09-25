import React from 'react';
import type { StyleProperties } from '../types/document';
import { useDocumentStore, useEditorStore } from '../state/context';
import { getResolvedStyleValue } from '../renderer/style-resolver';
import { InspectorField } from './ContentSection';
import {
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  AlignJustifyIcon,
} from '../components/Icons';

// ─── TypographySection ───────────────────────────────────────────────────────

export function TypographySection() {
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
        Typography
        <span className="rsb-inspector-section__viewport-badge">
          {viewport}
        </span>
      </h3>

      <InspectorField label="Font Family">
        <input
          type="text"
          className="rsb-input"
          value={getValue('fontFamily')}
          onChange={(e) => handleChange('fontFamily', e.target.value)}
          placeholder="Inter, sans-serif"
        />
      </InspectorField>

      <InspectorField label="Font Size">
        <input
          type="text"
          className="rsb-input"
          value={getValue('fontSize')}
          onChange={(e) => handleChange('fontSize', e.target.value)}
          placeholder="16px"
        />
      </InspectorField>

      <InspectorField label="Font Weight">
        <select
          className="rsb-select"
          value={getValue('fontWeight') || ''}
          onChange={(e) =>
            handleChange('fontWeight', e.target.value ? Number(e.target.value) : '')
          }
        >
          <option value="">Default</option>
          <option value="100">100 - Thin</option>
          <option value="200">200 - Extra Light</option>
          <option value="300">300 - Light</option>
          <option value="400">400 - Regular</option>
          <option value="500">500 - Medium</option>
          <option value="600">600 - Semi Bold</option>
          <option value="700">700 - Bold</option>
          <option value="800">800 - Extra Bold</option>
          <option value="900">900 - Black</option>
        </select>
      </InspectorField>

      <InspectorField label="Line Height">
        <input
          type="text"
          className="rsb-input"
          value={getValue('lineHeight')}
          onChange={(e) => handleChange('lineHeight', e.target.value)}
          placeholder="1.5"
        />
      </InspectorField>

      <InspectorField label="Letter Spacing">
        <input
          type="text"
          className="rsb-input"
          value={getValue('letterSpacing')}
          onChange={(e) => handleChange('letterSpacing', e.target.value)}
          placeholder="0px"
        />
      </InspectorField>

      <InspectorField label="Text Align">
        <div className="rsb-button-group">
          {(['left', 'center', 'right', 'justify'] as const).map((align) => (
            <button
              key={align}
              className={`rsb-button-group__btn ${
                getValue('textAlign') === align
                  ? 'rsb-button-group__btn--active'
                  : ''
              }`}
              onClick={() => handleChange('textAlign', align)}
              title={align}
            >
              {align === 'left' && <AlignLeftIcon size={14} />}
              {align === 'center' && <AlignCenterIcon size={14} />}
              {align === 'right' && <AlignRightIcon size={14} />}
              {align === 'justify' && <AlignJustifyIcon size={14} />}
            </button>
          ))}
        </div>
      </InspectorField>

      <InspectorField label="Text Decoration">
        <select
          className="rsb-select"
          value={getValue('textDecoration') || ''}
          onChange={(e) => handleChange('textDecoration', e.target.value)}
        >
          <option value="">None</option>
          <option value="underline">Underline</option>
          <option value="line-through">Strikethrough</option>
          <option value="overline">Overline</option>
        </select>
      </InspectorField>

      <InspectorField label="Text Transform">
        <select
          className="rsb-select"
          value={getValue('textTransform') || ''}
          onChange={(e) => handleChange('textTransform', e.target.value)}
        >
          <option value="">None</option>
          <option value="uppercase">UPPERCASE</option>
          <option value="lowercase">lowercase</option>
          <option value="capitalize">Capitalize</option>
        </select>
      </InspectorField>
    </div>
  );
}
