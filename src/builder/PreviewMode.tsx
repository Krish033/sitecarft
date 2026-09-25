import React, { useState } from 'react';
import type { Viewport } from '../types/document';
import { useDocumentStore, useEditorStore } from '../state/context';
import { NodeRenderer } from '../renderer/NodeRenderer';
import { VIEWPORT_WIDTHS, VIEWPORT_LABELS } from '../renderer/style-resolver';
import {
  ArrowLeftIcon,
  DesktopIcon,
  TabletIcon,
  MobileIcon,
  PreviewIcon,
} from '../components/Icons';

// ─── PreviewMode ─────────────────────────────────────────────────────────────

/**
 * Preview mode — renders the page using the same NodeRenderer
 * but without selection overlays, drag/drop, or editor controls.
 */
export function PreviewMode() {
  const rootId = useDocumentStore((s) => s.document.root);
  const rootNode = useDocumentStore((s) => s.document.nodes[s.document.root]);
  const viewport = useEditorStore((s) => s.viewport);
  const setViewport = useEditorStore((s) => s.setViewport);
  const setMode = useEditorStore((s) => s.setMode);

  const [fullWidth, setFullWidth] = useState(false);
  const viewportWidth = fullWidth ? '100%' : VIEWPORT_WIDTHS[viewport];
  const viewports: Viewport[] = ['desktop', 'tablet', 'mobile'];

  const hasChildren = rootNode && rootNode.children && rootNode.children.length > 0;

  return (
    <div className="rsb-preview">
      {/* Top Preview Toolbar */}
      <div className="rsb-preview__toolbar">
        <button
          className="rsb-preview__back-btn"
          onClick={() => setMode('edit')}
          title="Return to visual editor"
        >
          <ArrowLeftIcon size={16} />
          <span>Back to Editor</span>
        </button>

        <div className="rsb-toolbar__separator" />

        {/* Viewport switchers inside Preview */}
        <div className="rsb-toolbar__group rsb-toolbar__group--viewport">
          {viewports.map((vp) => (
            <button
              key={vp}
              className={`rsb-toolbar__viewport-btn ${
                !fullWidth && viewport === vp
                  ? 'rsb-toolbar__viewport-btn--active'
                  : ''
              }`}
              onClick={() => {
                setFullWidth(false);
                setViewport(vp);
              }}
              title={`${VIEWPORT_LABELS[vp]} (${VIEWPORT_WIDTHS[vp]}px)`}
            >
              {vp === 'desktop' && <DesktopIcon size={16} />}
              {vp === 'tablet' && <TabletIcon size={16} />}
              {vp === 'mobile' && <MobileIcon size={16} />}
              <span className="rsb-toolbar__viewport-label">
                {VIEWPORT_LABELS[vp]}
              </span>
            </button>
          ))}
          <button
            className={`rsb-toolbar__viewport-btn ${
              fullWidth ? 'rsb-toolbar__viewport-btn--active' : ''
            }`}
            onClick={() => setFullWidth(true)}
            title="Full Browser Width (100%)"
          >
            <span className="rsb-toolbar__viewport-label">100% Full</span>
          </button>
        </div>

        <div className="rsb-toolbar__spacer" />

        <div className="rsb-preview__info">
          <span className="rsb-preview__badge">
            Preview &bull; {fullWidth ? 'Full Width' : `${VIEWPORT_LABELS[viewport]} (${viewportWidth}px)`}
          </span>
        </div>
      </div>

      {/* Preview Viewport Frame with full horizontal and vertical scrolling */}
      <div className="rsb-preview__frame">
        <div className="rsb-preview__container">
          <div
            className="rsb-preview__viewport"
            style={{
              width: fullWidth ? '100%' : `${viewportWidth}px`,
              maxWidth: fullWidth ? '100%' : undefined,
            }}
          >
            {hasChildren ? (
              <NodeRenderer nodeId={rootId} isEditor={false} />
            ) : (
              <div className="rsb-preview__empty">
                <div className="rsb-preview__empty-icon">
                  <PreviewIcon size={44} />
                </div>
                <h3 className="rsb-preview__empty-title">Page Preview is Empty</h3>
                <p className="rsb-preview__empty-text">
                  Your page doesn't have any elements yet. Switch back to the editor to add layout sections, text, headings, or buttons.
                </p>
                <button
                  className="rsb-toolbar__btn rsb-toolbar__btn--primary"
                  onClick={() => setMode('edit')}
                >
                  <ArrowLeftIcon size={16} />
                  <span>Return to Editor</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
