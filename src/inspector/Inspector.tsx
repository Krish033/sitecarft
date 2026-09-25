import React, { useState } from 'react';
import { useEditorStore, useDocumentStore } from '../state/context';
import { ContentSection } from './ContentSection';
import { StyleSection } from './StyleSection';
import { TypographySection } from './TypographySection';
import { SpacingSection } from './SpacingSection';
import { LayoutSection } from './LayoutSection';
import { AnimationSection } from './AnimationSection';
import { AdvancedSection } from './AdvancedSection';

// ─── Inspector Tabs ──────────────────────────────────────────────────────────

type InspectorTab = 'content' | 'style' | 'layout';

const TABS: { id: InspectorTab; label: string }[] = [
  { id: 'content', label: 'Content' },
  { id: 'style', label: 'Style' },
  { id: 'layout', label: 'Layout' },
];

// ─── Inspector ───────────────────────────────────────────────────────────────

export function Inspector() {
  const selectedNodeId = useEditorStore((s) => s.selectedNodeId);
  const node = useDocumentStore((s) =>
    selectedNodeId ? s.document.nodes[selectedNodeId] : null
  );

  const [activeTab, setActiveTab] = useState<InspectorTab>('content');

  if (!selectedNodeId || !node) {
    return (
      <div className="rsb-inspector rsb-inspector--empty">
        <div className="rsb-inspector__empty-state">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <p>Select an element to edit its properties</p>
        </div>
      </div>
    );
  }

  const nodeLabel =
    (node.props.label as string) ||
    node.type.charAt(0).toUpperCase() + node.type.slice(1);

  return (
    <div className="rsb-inspector">
      {/* Header */}
      <div className="rsb-inspector__header">
        <span className="rsb-inspector__node-type">{nodeLabel}</span>
        <span className="rsb-inspector__node-id">{node.id.slice(0, 8)}</span>
      </div>

      {/* Tabs */}
      <div className="rsb-inspector__tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`rsb-inspector__tab ${
              activeTab === tab.id ? 'rsb-inspector__tab--active' : ''
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="rsb-inspector__content">
        {activeTab === 'content' && (
          <>
            <ContentSection />
            <AnimationSection />
          </>
        )}

        {activeTab === 'style' && (
          <>
            <StyleSection />
            <TypographySection />
            <SpacingSection />
          </>
        )}

        {activeTab === 'layout' && (
          <>
            <LayoutSection />
            <AdvancedSection />
          </>
        )}
      </div>
    </div>
  );
}
