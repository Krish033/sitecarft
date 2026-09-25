import React, { useCallback } from 'react';
import type { Viewport } from '../types/document';
import {
  useDocumentStore,
  useEditorStore,
  useDocumentStoreApi,
  useEditorStoreApi,
} from '../state/context';
import { VIEWPORT_WIDTHS, VIEWPORT_LABELS } from '../renderer/style-resolver';
import { copyNode, preparePaste } from '../state/operations';
import { findParentId } from '../utils/document';
import {
  UndoIcon,
  RedoIcon,
  CopyIcon,
  PasteIcon,
  DuplicateIcon,
  DeleteIcon,
  DesktopIcon,
  TabletIcon,
  MobileIcon,
  PreviewIcon,
  EditIcon,
  SaveIcon,
  PublishIcon,
} from '../components/Icons';

// ─── Props ───────────────────────────────────────────────────────────────────

interface EditorToolbarProps {
  onSave?: (doc: any) => void;
  onPublish?: (doc: any) => void;
}

// ─── EditorToolbar ───────────────────────────────────────────────────────────

export function EditorToolbar({ onSave, onPublish }: EditorToolbarProps) {
  const viewport = useEditorStore((s) => s.viewport);
  const mode = useEditorStore((s) => s.mode);
  const setViewport = useEditorStore((s) => s.setViewport);
  const setMode = useEditorStore((s) => s.setMode);
  const selectedNodeId = useEditorStore((s) => s.selectedNodeId);
  const selectNode = useEditorStore((s) => s.selectNode);
  const clipboard = useEditorStore((s) => s.clipboard);
  const setClipboard = useEditorStore((s) => s.setClipboard);

  const canUndo = useDocumentStore((s) => s.canUndo);
  const canRedo = useDocumentStore((s) => s.canRedo);
  const undo = useDocumentStore((s) => s.undo);
  const redo = useDocumentStore((s) => s.redo);
  const document = useDocumentStore((s) => s.document);
  const removeNode = useDocumentStore((s) => s.removeNode);
  const duplicateNode = useDocumentStore((s) => s.duplicateNode);
  const addNodeWithChildren = useDocumentStore((s) => s.addNodeWithChildren);
  const docStoreApi = useDocumentStoreApi();

  const viewports: Viewport[] = ['desktop', 'tablet', 'mobile'];

  // ── Copy ─────────────────────────────────────────────────────────────
  const handleCopy = useCallback(() => {
    if (!selectedNodeId) return;
    const data = copyNode(document.nodes, selectedNodeId);
    if (data) setClipboard(data);
  }, [selectedNodeId, document.nodes, setClipboard]);

  // ── Paste ────────────────────────────────────────────────────────────
  const handlePaste = useCallback(() => {
    if (!clipboard || !selectedNodeId) return;
    const { clonedNodes, newRootId } = preparePaste(clipboard);
    const rootNode = clonedNodes[newRootId];
    if (!rootNode) return;

    // Paste as sibling of selected node
    const parentId = findParentId(document.nodes, selectedNodeId);
    const target = parentId || document.root;

    addNodeWithChildren(target, rootNode, clonedNodes);
    selectNode(newRootId);
  }, [clipboard, selectedNodeId, document, addNodeWithChildren, selectNode]);

  // ── Duplicate ────────────────────────────────────────────────────────
  const handleDuplicate = useCallback(() => {
    if (!selectedNodeId) return;
    const newId = duplicateNode(selectedNodeId);
    if (newId) selectNode(newId);
  }, [selectedNodeId, duplicateNode, selectNode]);

  // ── Delete ───────────────────────────────────────────────────────────
  const handleDelete = useCallback(() => {
    if (!selectedNodeId || selectedNodeId === document.root) return;
    removeNode(selectedNodeId);
    selectNode(null);
  }, [selectedNodeId, document.root, removeNode, selectNode]);

  // ── Save ─────────────────────────────────────────────────────────────
  const handleSave = useCallback(() => {
    const doc = docStoreApi.getState().document;
    onSave?.(doc);
  }, [onSave, docStoreApi]);

  // ── Publish ──────────────────────────────────────────────────────────
  const handlePublish = useCallback(() => {
    const doc = docStoreApi.getState().document;
    onPublish?.(doc);
  }, [onPublish, docStoreApi]);

  return (
    <div className="rsb-toolbar">
      {/* Left: History */}
      <div className="rsb-toolbar__group">
        <button
          className="rsb-toolbar__btn"
          onClick={undo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          <UndoIcon size={16} />
        </button>
        <button
          className="rsb-toolbar__btn"
          onClick={redo}
          disabled={!canRedo}
          title="Redo (Ctrl+Shift+Z)"
        >
          <RedoIcon size={16} />
        </button>
      </div>

      <div className="rsb-toolbar__separator" />

      {/* Node operations */}
      <div className="rsb-toolbar__group">
        <button
          className="rsb-toolbar__btn"
          onClick={handleCopy}
          disabled={!selectedNodeId}
          title="Copy (Ctrl+C)"
        >
          <CopyIcon size={16} />
        </button>
        <button
          className="rsb-toolbar__btn"
          onClick={handlePaste}
          disabled={!clipboard}
          title="Paste (Ctrl+V)"
        >
          <PasteIcon size={16} />
        </button>
        <button
          className="rsb-toolbar__btn"
          onClick={handleDuplicate}
          disabled={!selectedNodeId}
          title="Duplicate (Ctrl+D)"
        >
          <DuplicateIcon size={16} />
        </button>
        <button
          className="rsb-toolbar__btn rsb-toolbar__btn--danger"
          onClick={handleDelete}
          disabled={!selectedNodeId || selectedNodeId === document.root}
          title="Delete (Del)"
        >
          <DeleteIcon size={16} />
        </button>
      </div>

      <div className="rsb-toolbar__separator" />

      {/* Center: Viewport */}
      <div className="rsb-toolbar__group rsb-toolbar__group--viewport">
        {viewports.map((vp) => (
          <button
            key={vp}
            className={`rsb-toolbar__viewport-btn ${
              viewport === vp ? 'rsb-toolbar__viewport-btn--active' : ''
            }`}
            onClick={() => setViewport(vp)}
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
      </div>

      <div className="rsb-toolbar__spacer" />

      {/* Right: Mode + Save */}
      <div className="rsb-toolbar__group">
        <button
          className={`rsb-toolbar__btn ${
            mode === 'preview' ? 'rsb-toolbar__btn--active' : ''
          }`}
          onClick={() => setMode(mode === 'edit' ? 'preview' : 'edit')}
          title="Toggle Preview"
        >
          {mode === 'edit' ? (
            <>
              <PreviewIcon size={16} />
              <span>Preview</span>
            </>
          ) : (
            <>
              <EditIcon size={16} />
              <span>Edit</span>
            </>
          )}
        </button>
      </div>

      <div className="rsb-toolbar__group">
        {onSave && (
          <button
            className="rsb-toolbar__btn rsb-toolbar__btn--primary"
            onClick={handleSave}
            title="Save Page Document"
          >
            <SaveIcon size={16} />
            <span>Save</span>
          </button>
        )}
      </div>
    </div>
  );
}

