import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { useDocumentStore, useEditorStore } from '../state/context';
import { CanvasNode } from './CanvasNode';
import { VIEWPORT_WIDTHS } from '../renderer/style-resolver';

// ─── Canvas ──────────────────────────────────────────────────────────────────

export function Canvas() {
  const rootId = useDocumentStore((s) => s.document.root);
  const rootNode = useDocumentStore((s) => s.document.nodes[s.document.root]);
  const viewport = useEditorStore((s) => s.viewport);
  const selectNode = useEditorStore((s) => s.selectNode);
  const canvasRef = useRef<HTMLDivElement>(null);

  const viewportWidth = VIEWPORT_WIDTHS[viewport];

  // Click on empty canvas area deselects
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget || e.target === canvasRef.current) {
        selectNode(null);
      }
    },
    [selectNode]
  );

  // Set up IntersectionObserver for scroll-triggered animations
  useEffect(() => {
    if (!canvasRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const animType = el.getAttribute('data-rsb-animate');
            const duration = el.getAttribute('data-rsb-duration') || '500';
            const delay = el.getAttribute('data-rsb-delay') || '0';

            if (animType) {
              el.style.animation = `rsb-${animType} ${duration}ms ${delay}ms ease both`;
              observer.unobserve(el);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = canvasRef.current.querySelectorAll('[data-rsb-animate]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  });

  // Droppable for the page root
  const { setNodeRef: setDroppableRef } = useDroppable({
    id: rootId,
    data: { source: 'canvas', nodeId: rootId, type: 'page', isContainer: true },
  });

  // Child IDs for sortable
  const childIds = rootNode?.children || [];

  return (
    <div className="rsb-canvas" onClick={handleCanvasClick}>
      <div
        className="rsb-canvas__viewport"
        style={{
          width: `${viewportWidth}px`,
        }}
      >
        <div
          ref={(el) => {
            (canvasRef as any).current = el;
            setDroppableRef(el);
          }}
          className="rsb-canvas__page"
          data-node-id={rootId}
          onClick={handleCanvasClick}
        >
          <SortableContext
            items={childIds}
            strategy={verticalListSortingStrategy}
          >
            {childIds.map((childId) => (
              <CanvasNode key={childId} nodeId={childId} />
            ))}
          </SortableContext>

          {childIds.length === 0 && (
            <div className="rsb-canvas__empty">
              <div className="rsb-canvas__empty-icon">
                <svg
                  width="44"
                  height="44"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="3" strokeDasharray="4 4" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
              </div>
              <h3 className="rsb-canvas__empty-title">Canvas is empty</h3>
              <p className="rsb-canvas__empty-text">
                Drag layout elements (Section, Container, Row) from the left panel, or click any element in the sidebar to insert it.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
