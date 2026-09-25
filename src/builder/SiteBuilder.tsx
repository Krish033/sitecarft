import React, { useCallback, useEffect, useRef } from 'react';
import type { PageDocument, BuilderProps } from '../types/document';
import { createDocumentStore, DocumentStore } from '../state/document-store';
import { createEditorStore, EditorStore } from '../state/editor-store';
import {
  BuilderProvider,
  useDocumentStore,
  useEditorStore,
  useDocumentStoreApi,
  useEditorStoreApi,
} from '../state/context';
import { createEmptyDocument } from '../utils/document';
import { copyNode, preparePaste } from '../state/operations';
import { findParentId } from '../utils/document';
import { DragDropProvider } from '../canvas/DragDropProvider';
import { Canvas } from '../canvas/Canvas';
import { Inspector } from '../inspector/Inspector';
import { Navigator } from '../navigator/Navigator';
import { ComponentPanel } from './ComponentPanel';
import { EditorToolbar } from './EditorToolbar';
import { PreviewMode } from './PreviewMode';
import { StatusBar } from './StatusBar';
import { ComponentsGridIcon, LayersIcon } from '../components/Icons';
import '../styles/editor.css';


// ─── Internal EditorShell ────────────────────────────────────────────────────

interface EditorShellProps {
  onSave?: (doc: PageDocument) => void;
  onPublish?: (doc: PageDocument) => void;
}

function EditorShell({ onSave, onPublish }: EditorShellProps) {
  const mode = useEditorStore((s) => s.mode);
  const leftPanelTab = useEditorStore((s) => s.leftPanelTab);
  const setLeftPanelTab = useEditorStore((s) => s.setLeftPanelTab);
  const docStoreApi = useDocumentStoreApi();
  const editorStoreApi = useEditorStoreApi();

  // ── Keyboard Shortcuts ─────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isCtrl = e.ctrlKey || e.metaKey;

      // Undo: Ctrl+Z
      if (isCtrl && !e.shiftKey && e.key === 'z') {
        e.preventDefault();
        docStoreApi.getState().undo();
        return;
      }

      // Redo: Ctrl+Shift+Z
      if (isCtrl && e.shiftKey && e.key === 'z') {
        e.preventDefault();
        docStoreApi.getState().redo();
        return;
      }

      // Redo: Ctrl+Y
      if (isCtrl && e.key === 'y') {
        e.preventDefault();
        docStoreApi.getState().redo();
        return;
      }

      // Copy: Ctrl+C
      if (isCtrl && e.key === 'c') {
        const selectedId = editorStoreApi.getState().selectedNodeId;
        if (!selectedId) return;
        // Don't intercept if user is editing text
        const active = document.activeElement;
        if (
          active instanceof HTMLInputElement ||
          active instanceof HTMLTextAreaElement ||
          (active as HTMLElement)?.isContentEditable
        ) {
          return;
        }
        e.preventDefault();
        const nodes = docStoreApi.getState().document.nodes;
        const data = copyNode(nodes, selectedId);
        if (data) editorStoreApi.getState().setClipboard(data);
        return;
      }

      // Paste: Ctrl+V
      if (isCtrl && e.key === 'v') {
        const clipboard = editorStoreApi.getState().clipboard;
        const selectedId = editorStoreApi.getState().selectedNodeId;
        if (!clipboard || !selectedId) return;
        const active = document.activeElement;
        if (
          active instanceof HTMLInputElement ||
          active instanceof HTMLTextAreaElement ||
          (active as HTMLElement)?.isContentEditable
        ) {
          return;
        }
        e.preventDefault();
        const { clonedNodes, newRootId } = preparePaste(clipboard);
        const rootNode = clonedNodes[newRootId];
        if (!rootNode) return;
        const doc = docStoreApi.getState().document;
        const parentId = findParentId(doc.nodes, selectedId) || doc.root;
        docStoreApi.getState().addNodeWithChildren(parentId, rootNode, clonedNodes);
        editorStoreApi.getState().selectNode(newRootId);
        return;
      }

      // Duplicate: Ctrl+D
      if (isCtrl && e.key === 'd') {
        const selectedId = editorStoreApi.getState().selectedNodeId;
        if (!selectedId) return;
        e.preventDefault();
        const newId = docStoreApi.getState().duplicateNode(selectedId);
        if (newId) editorStoreApi.getState().selectNode(newId);
        return;
      }

      // Delete: Delete or Backspace
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const selectedId = editorStoreApi.getState().selectedNodeId;
        if (!selectedId) return;
        const active = document.activeElement;
        if (
          active instanceof HTMLInputElement ||
          active instanceof HTMLTextAreaElement ||
          (active as HTMLElement)?.isContentEditable
        ) {
          return;
        }
        const doc = docStoreApi.getState().document;
        if (selectedId === doc.root) return;
        e.preventDefault();
        docStoreApi.getState().removeNode(selectedId);
        editorStoreApi.getState().selectNode(null);
        return;
      }

      // Escape: deselect
      if (e.key === 'Escape') {
        editorStoreApi.getState().selectNode(null);
        return;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [docStoreApi, editorStoreApi]);

  // ── Preview Mode ──────────────────────────────────────────────────────
  if (mode === 'preview') {
    return <PreviewMode />;
  }

  // ── Editor Mode ───────────────────────────────────────────────────────
  return (
    <div className="rsb-editor">
      <EditorToolbar onSave={onSave} onPublish={onPublish} />

      <div className="rsb-editor__body">
        {/* Left Panel */}
        <div className="rsb-editor__panel-left">
          <div className="rsb-panel-tabs">
            <button
              className={`rsb-panel-tabs__btn ${
                leftPanelTab === 'components'
                  ? 'rsb-panel-tabs__btn--active'
                  : ''
              }`}
              onClick={() => setLeftPanelTab('components')}
            >
              <ComponentsGridIcon size={16} />
              <span>Components</span>
            </button>
            <button
              className={`rsb-panel-tabs__btn ${
                leftPanelTab === 'navigator'
                  ? 'rsb-panel-tabs__btn--active'
                  : ''
              }`}
              onClick={() => setLeftPanelTab('navigator')}
            >
              <LayersIcon size={16} />
              <span>Layers</span>
            </button>
          </div>


          {leftPanelTab === 'components' && <ComponentPanel />}
          {leftPanelTab === 'navigator' && <Navigator />}
        </div>

        {/* Canvas */}
        <div className="rsb-editor__canvas">
          <Canvas />
        </div>

        {/* Right Panel — Inspector */}
        <div className="rsb-editor__panel-right">
          <Inspector />
        </div>
      </div>

      <StatusBar />
    </div>
  );
}

// ─── SiteBuilder (Public API) ────────────────────────────────────────────────

/**
 * The main visual site builder component.
 *
 * @example
 * ```tsx
 * import { SiteBuilder } from '@bcsp/react-site-builder';
 * import '@bcsp/react-site-builder/dist/styles.css';
 *
 * function BuilderPage() {
 *   const [doc, setDoc] = useState(null);
 *   return (
 *     <SiteBuilder
 *       value={doc}
 *       onChange={setDoc}
 *       onSave={(d) => api.savePage(d)}
 *     />
 *   );
 * }
 * ```
 */
export function SiteBuilder({
  value,
  onChange,
  onSave,
  onPublish,
}: BuilderProps) {
  // Create stores (once per mount)
  const docStoreRef = useRef<DocumentStore | null>(null);
  const editorStoreRef = useRef<EditorStore | null>(null);

  if (!docStoreRef.current) {
    docStoreRef.current = createDocumentStore(
      value || createEmptyDocument()
    );
  }
  if (!editorStoreRef.current) {
    editorStoreRef.current = createEditorStore();
  }

  // ── Sync external value → internal store ──────────────────────────────
  const prevValueIdRef = useRef(value?.id);
  useEffect(() => {
    if (value && value.id !== prevValueIdRef.current) {
      prevValueIdRef.current = value.id;
      docStoreRef.current?.getState().replaceDocument(value);
    }
  }, [value]);

  // ── Sync internal store → external onChange ───────────────────────────
  useEffect(() => {
    if (!onChange || !docStoreRef.current) return;

    const unsub = docStoreRef.current.subscribe((state, prevState) => {
      if (state.document !== prevState.document) {
        onChange(state.document);
      }
    });

    return unsub;
  }, [onChange]);

  return (
    <BuilderProvider
      documentStore={docStoreRef.current}
      editorStore={editorStoreRef.current}
    >
      <DragDropProvider>
        <EditorShell onSave={onSave} onPublish={onPublish} />
      </DragDropProvider>
    </BuilderProvider>
  );
}
