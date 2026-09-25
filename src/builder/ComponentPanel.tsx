import React, { useCallback } from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { NodeType } from '../types/document';
import { CONTAINER_TYPES } from '../types/document';
import { COMPONENT_DEFINITIONS } from '../components/registry';
import { getNodeTypeIcon, GripIcon, PlusIcon } from '../components/Icons';
import {
  useDocumentStoreApi,
  useEditorStoreApi,
} from '../state/context';
import { findParentId } from '../utils/document';

// ─── DraggableComponent ─────────────────────────────────────────────────────

function DraggableComponent({
  type,
  label,
}: {
  type: string;
  label: string;
}) {
  const documentStore = useDocumentStoreApi();
  const editorStore = useEditorStoreApi();

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-${type}`,
    data: {
      source: 'sidebar',
      nodeType: type,
      label,
    },
  });

  const handleClick = useCallback(() => {
    // Click to add: insert directly into current container or root
    const doc = documentStore.getState().document;
    const selectedId = editorStore.getState().selectedNodeId;
    let targetId = doc.root;

    if (selectedId && doc.nodes[selectedId]) {
      const selectedNode = doc.nodes[selectedId];
      if (CONTAINER_TYPES.includes(selectedNode.type)) {
        targetId = selectedId;
      } else {
        const parentId = findParentId(doc.nodes, selectedId);
        if (parentId) targetId = parentId;
      }
    }

    const newNode = documentStore.getState().addNode(targetId, type as NodeType);
    editorStore.getState().selectNode(newNode.id);
  }, [documentStore, editorStore, type]);

  return (
    <div
      ref={setNodeRef}
      className={`rsb-component-item ${isDragging ? 'rsb-component-item--dragging' : ''}`}
      onClick={handleClick}
      title={`Click to add or drag ${label} onto canvas`}
      {...attributes}
      {...listeners}
    >
      <div className="rsb-component-item__icon">
        {getNodeTypeIcon(type, 22)}
      </div>
      <span className="rsb-component-item__label">{label}</span>
    </div>
  );
}

// ─── ComponentPanel ──────────────────────────────────────────────────────────

export function ComponentPanel() {
  const layoutComponents = COMPONENT_DEFINITIONS.filter(
    (c) => c.category === 'layout'
  );
  const basicComponents = COMPONENT_DEFINITIONS.filter(
    (c) => c.category === 'basic'
  );

  return (
    <div className="rsb-component-panel">
      {/* Layout group */}
      <div className="rsb-component-group">
        <div className="rsb-component-group__header">
          <h4 className="rsb-component-group__title">Layout</h4>
          <span className="rsb-component-group__hint">Drag or click</span>
        </div>
        <div className="rsb-component-group__items">
          {layoutComponents.map((comp) => (
            <DraggableComponent
              key={comp.type}
              type={comp.type}
              label={comp.label}
            />
          ))}
        </div>
      </div>

      {/* Basic group */}
      <div className="rsb-component-group">
        <div className="rsb-component-group__header">
          <h4 className="rsb-component-group__title">Elements</h4>
          <span className="rsb-component-group__hint">Drag or click</span>
        </div>
        <div className="rsb-component-group__items">
          {basicComponents.map((comp) => (
            <DraggableComponent
              key={comp.type}
              type={comp.type}
              label={comp.label}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

