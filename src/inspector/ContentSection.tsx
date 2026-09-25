import React from 'react';
import { useDocumentStore, useEditorStore } from '../state/context';

// ─── Shared Inspector Field Components ───────────────────────────────────────

interface FieldProps {
  label: string;
  children: React.ReactNode;
}

export function InspectorField({ label, children }: FieldProps) {
  return (
    <div className="rsb-inspector-field">
      <label className="rsb-inspector-field__label">{label}</label>
      <div className="rsb-inspector-field__control">{children}</div>
    </div>
  );
}

// ─── ContentSection ──────────────────────────────────────────────────────────

export function ContentSection() {
  const selectedId = useEditorStore((s) => s.selectedNodeId);
  const node = useDocumentStore((s) =>
    selectedId ? s.document.nodes[selectedId] : null
  );

  const updateNodeProps = useDocumentStore((s) => s.updateNodeProps);

  if (!node || !selectedId) return null;

  const handleChange = (key: string, value: unknown) => {
    updateNodeProps(selectedId, { [key]: value });
  };

  return (
    <div className="rsb-inspector-section">
      <h3 className="rsb-inspector-section__title">Content</h3>

      {/* Heading */}
      {node.type === 'heading' && (
        <>
          <InspectorField label="Text">
            <input
              type="text"
              className="rsb-input"
              value={(node.props.text as string) || ''}
              onChange={(e) => handleChange('text', e.target.value)}
            />
          </InspectorField>
          <InspectorField label="Level">
            <select
              className="rsb-select"
              value={(node.props.level as number) || 2}
              onChange={(e) => handleChange('level', Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6].map((l) => (
                <option key={l} value={l}>
                  H{l}
                </option>
              ))}
            </select>
          </InspectorField>
        </>
      )}

      {/* Text */}
      {node.type === 'text' && (
        <InspectorField label="Text">
          <textarea
            className="rsb-textarea"
            value={(node.props.text as string) || ''}
            onChange={(e) => handleChange('text', e.target.value)}
            rows={4}
          />
        </InspectorField>
      )}

      {/* Button */}
      {node.type === 'button' && (
        <>
          <InspectorField label="Text">
            <input
              type="text"
              className="rsb-input"
              value={(node.props.text as string) || ''}
              onChange={(e) => handleChange('text', e.target.value)}
            />
          </InspectorField>
          <InspectorField label="URL">
            <input
              type="text"
              className="rsb-input"
              value={(node.props.url as string) || ''}
              onChange={(e) => handleChange('url', e.target.value)}
            />
          </InspectorField>
          <InspectorField label="Variant">
            <select
              className="rsb-select"
              value={(node.props.variant as string) || 'primary'}
              onChange={(e) => handleChange('variant', e.target.value)}
            >
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="outline">Outline</option>
              <option value="ghost">Ghost</option>
            </select>
          </InspectorField>
        </>
      )}

      {/* Image */}
      {node.type === 'image' && (
        <>
          <InspectorField label="Image URL">
            <input
              type="text"
              className="rsb-input"
              value={(node.props.src as string) || ''}
              onChange={(e) => handleChange('src', e.target.value)}
              placeholder="https://..."
            />
          </InspectorField>
          <InspectorField label="Alt Text">
            <input
              type="text"
              className="rsb-input"
              value={(node.props.alt as string) || ''}
              onChange={(e) => handleChange('alt', e.target.value)}
            />
          </InspectorField>
          <InspectorField label="Object Fit">
            <select
              className="rsb-select"
              value={(node.props.objectFit as string) || 'cover'}
              onChange={(e) => handleChange('objectFit', e.target.value)}
            >
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
              <option value="fill">Fill</option>
              <option value="none">None</option>
              <option value="scale-down">Scale Down</option>
            </select>
          </InspectorField>
        </>
      )}

      {/* Divider */}
      {node.type === 'divider' && (
        <>
          <InspectorField label="Style">
            <select
              className="rsb-select"
              value={(node.props.lineStyle as string) || 'solid'}
              onChange={(e) => handleChange('lineStyle', e.target.value)}
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
            </select>
          </InspectorField>
          <InspectorField label="Thickness">
            <input
              type="text"
              className="rsb-input"
              value={(node.props.thickness as string) || '1px'}
              onChange={(e) => handleChange('thickness', e.target.value)}
            />
          </InspectorField>
          <InspectorField label="Color">
            <input
              type="color"
              className="rsb-color-input"
              value={(node.props.color as string) || '#e0e0e0'}
              onChange={(e) => handleChange('color', e.target.value)}
            />
          </InspectorField>
        </>
      )}

      {/* Spacer */}
      {node.type === 'spacer' && (
        <InspectorField label="Height">
          <input
            type="text"
            className="rsb-input"
            value={(node.props.height as string) || '40px'}
            onChange={(e) => handleChange('height', e.target.value)}
          />
        </InspectorField>
      )}

      {/* Custom HTML */}
      {node.type === 'custom-html' && (
        <>
          <InspectorField label="HTML">
            <textarea
              className="rsb-textarea rsb-textarea--code"
              value={(node.props.html as string) || ''}
              onChange={(e) => handleChange('html', e.target.value)}
              rows={8}
              spellCheck={false}
            />
          </InspectorField>
          <InspectorField label="CSS">
            <textarea
              className="rsb-textarea rsb-textarea--code"
              value={(node.props.css as string) || ''}
              onChange={(e) => handleChange('css', e.target.value)}
              rows={4}
              spellCheck={false}
            />
          </InspectorField>
        </>
      )}

      {/* Container label */}
      {['section', 'container', 'row', 'column'].includes(node.type) && (
        <InspectorField label="Label">
          <input
            type="text"
            className="rsb-input"
            value={(node.props.label as string) || ''}
            onChange={(e) => handleChange('label', e.target.value)}
          />
        </InspectorField>
      )}
    </div>
  );
}
