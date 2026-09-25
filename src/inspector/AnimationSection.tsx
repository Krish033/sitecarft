import React from 'react';
import type { AnimationType, AnimationTrigger, AnimationConfig } from '../types/document';
import { useDocumentStore, useEditorStore } from '../state/context';
import { InspectorField } from './ContentSection';
import { DEFAULT_ANIMATION } from '../utils/document';

const ANIMATION_TYPES: { value: AnimationType; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'fadeIn', label: 'Fade In' },
  { value: 'slideUp', label: 'Slide Up' },
  { value: 'slideDown', label: 'Slide Down' },
  { value: 'slideLeft', label: 'Slide Left' },
  { value: 'slideRight', label: 'Slide Right' },
  { value: 'scale', label: 'Scale' },
];

const TRIGGERS: { value: AnimationTrigger; label: string }[] = [
  { value: 'onLoad', label: 'On Load' },
  { value: 'onScroll', label: 'On Scroll' },
  { value: 'onHover', label: 'On Hover' },
];

// ─── AnimationSection ────────────────────────────────────────────────────────

export function AnimationSection() {
  const selectedId = useEditorStore((s) => s.selectedNodeId);
  const node = useDocumentStore((s) =>
    selectedId ? s.document.nodes[selectedId] : null
  );

  const updateNodeAnimation = useDocumentStore((s) => s.updateNodeAnimation);

  if (!node || !selectedId) return null;

  const animation: AnimationConfig = node.animation || { ...DEFAULT_ANIMATION };

  const handleChange = (updates: Partial<AnimationConfig>) => {
    updateNodeAnimation(selectedId, { ...animation, ...updates });
  };

  return (
    <div className="rsb-inspector-section">
      <h3 className="rsb-inspector-section__title">Animation</h3>

      <InspectorField label="Type">
        <select
          className="rsb-select"
          value={animation.type}
          onChange={(e) =>
            handleChange({ type: e.target.value as AnimationType })
          }
        >
          {ANIMATION_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </InspectorField>

      {animation.type !== 'none' && (
        <>
          <InspectorField label="Trigger">
            <select
              className="rsb-select"
              value={animation.trigger}
              onChange={(e) =>
                handleChange({ trigger: e.target.value as AnimationTrigger })
              }
            >
              {TRIGGERS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </InspectorField>

          <InspectorField label="Duration (ms)">
            <input
              type="number"
              className="rsb-input"
              value={animation.duration}
              onChange={(e) =>
                handleChange({ duration: Number(e.target.value) || 0 })
              }
              min={0}
              max={5000}
              step={50}
            />
          </InspectorField>

          <InspectorField label="Delay (ms)">
            <input
              type="number"
              className="rsb-input"
              value={animation.delay}
              onChange={(e) =>
                handleChange({ delay: Number(e.target.value) || 0 })
              }
              min={0}
              max={3000}
              step={50}
            />
          </InspectorField>
        </>
      )}
    </div>
  );
}
