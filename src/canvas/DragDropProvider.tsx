import React, { useCallback, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { CONTAINER_TYPES } from '../types/document';
import type { NodeType } from '../types/document';
import {
  useDocumentStoreApi,
  useEditorStoreApi,
} from '../state/context';
import { findParentId } from '../utils/document';
import { getNodeTypeIcon } from '../components/Icons';

// ─── Props ───────────────────────────────────────────────────────────────────

interface DragDropProviderProps {
  children: React.ReactNode;
}

interface ActiveDragInfo {
  id: string;
  source: 'sidebar' | 'canvas';
  nodeType?: string;
  label?: string;
}

// ─── DragDropProvider ────────────────────────────────────────────────────────

export function DragDropProvider({ children }: DragDropProviderProps) {
  const documentStore = useDocumentStoreApi();
  const editorStore = useEditorStoreApi();
  const [activeDrag, setActiveDrag] = useState<ActiveDragInfo | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    })
  );

  // ── Drag Start ─────────────────────────────────────────────────────────
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const activeData = event.active.data.current;
      const doc = documentStore.getState().document;
      let label = activeData?.label;
      let nodeType = activeData?.nodeType || activeData?.type;

      if (activeData?.source === 'canvas') {
        const node = doc.nodes[event.active.id as string];
        if (node) {
          nodeType = node.type;
          label = (node.props.label as string) || (node.props.text as string) || node.type;
        }
      }

      setActiveDrag({
        id: event.active.id as string,
        source: activeData?.source || 'sidebar',
        nodeType,
        label,
      });

      editorStore.getState().setDragging(true);
    },
    [documentStore, editorStore]
  );

  // ── Drag End ───────────────────────────────────────────────────────────
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveDrag(null);
      editorStore.getState().setDragging(false);

      const { active, over } = event;
      if (!over) return;

      const activeData = active.data.current;

      // ── Case 1: Sidebar → Canvas (add new node) ─────────────────────
      if (activeData?.source === 'sidebar') {
        const nodeType = activeData.nodeType as NodeType;
        const targetId = over.id as string;

        // Determine where to insert
        const doc = documentStore.getState().document;
        const targetNode = doc.nodes[targetId];

        if (targetNode) {
          // If dropping on a container, add as child
          if (CONTAINER_TYPES.includes(targetNode.type)) {
            const newNode = documentStore.getState().addNode(targetId, nodeType);
            editorStore.getState().selectNode(newNode.id);
          } else {
            // If dropping on a non-container, add as sibling
            const parentId = findParentId(doc.nodes, targetId);
            if (parentId) {
              const parent = doc.nodes[parentId];
              const targetIndex = parent.children.indexOf(targetId);
              const newNode = documentStore
                .getState()
                .addNode(parentId, nodeType, targetIndex + 1);
              editorStore.getState().selectNode(newNode.id);
            }
          }
        } else {
          // Drop on the root
          const newNode = documentStore
            .getState()
            .addNode(doc.root, nodeType);
          editorStore.getState().selectNode(newNode.id);
        }
        return;
      }

      // ── Case 2: Canvas → Canvas (reorder/move) ─────────────────────
      if (activeData?.source === 'canvas') {
        const activeId = active.id as string;
        const overId = over.id as string;

        if (activeId === overId) return;

        const doc = documentStore.getState().document;
        const activeParentId = findParentId(doc.nodes, activeId);
        if (!activeParentId) return;

        const overNode = doc.nodes[overId];
        if (!overNode) return;

        // If over a container, move into it
        if (
          CONTAINER_TYPES.includes(overNode.type) &&
          overId !== activeParentId
        ) {
          documentStore
            .getState()
            .moveNode(activeId, overId, overNode.children.length);
          return;
        }

        // Otherwise, reorder within the same parent or move to sibling position
        const overParentId = findParentId(doc.nodes, overId);
        if (!overParentId) return;

        if (activeParentId === overParentId) {
          // Same parent — reorder
          const parent = doc.nodes[activeParentId];
          const oldIndex = parent.children.indexOf(activeId);
          const newIndex = parent.children.indexOf(overId);

          if (oldIndex === -1 || newIndex === -1) return;

          const newChildren = [...parent.children];
          newChildren.splice(oldIndex, 1);
          newChildren.splice(newIndex, 0, activeId);

          documentStore.getState().reorderChildren(activeParentId, newChildren);
        } else {
          // Different parent — move
          const overParent = doc.nodes[overParentId];
          const overIndex = overParent.children.indexOf(overId);
          documentStore
            .getState()
            .moveNode(activeId, overParentId, overIndex + 1);
        }
      }
    },
    [documentStore, editorStore]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {children}

      <DragOverlay dropAnimation={{ duration: 180, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
        {activeDrag ? (
          <div className="rsb-drag-overlay-card">
            <div className="rsb-drag-overlay-card__icon">
              {getNodeTypeIcon(activeDrag.nodeType || '', 20)}
            </div>
            <div className="rsb-drag-overlay-card__content">
              <span className="rsb-drag-overlay-card__title">
                {activeDrag.label || activeDrag.nodeType}
              </span>
              <span className="rsb-drag-overlay-card__badge">
                {activeDrag.source === 'sidebar' ? 'Insert' : 'Move'}
              </span>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

