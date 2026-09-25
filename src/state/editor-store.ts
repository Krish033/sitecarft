import { createStore } from 'zustand/vanilla';
import type { Viewport, Node } from '../types/document';
import type {
  EditorMode,
  LeftPanelTab,
  ClipboardData,
} from '../types/editor';

// ─── Store State ─────────────────────────────────────────────────────────────

export interface EditorStoreState {
  mode: EditorMode;
  viewport: Viewport;
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  leftPanelTab: LeftPanelTab;
  clipboard: ClipboardData | null;
  isDragging: boolean;
  inspectorOpen: boolean;

  // ── Actions ────────────────────────────────────────────────────────────
  setMode: (mode: EditorMode) => void;
  setViewport: (viewport: Viewport) => void;
  selectNode: (nodeId: string | null) => void;
  hoverNode: (nodeId: string | null) => void;
  setLeftPanelTab: (tab: LeftPanelTab) => void;
  setClipboard: (data: ClipboardData | null) => void;
  setDragging: (dragging: boolean) => void;
  setInspectorOpen: (open: boolean) => void;
}

// ─── Store Factory ───────────────────────────────────────────────────────────

export type EditorStore = ReturnType<typeof createEditorStore>;

export function createEditorStore() {
  return createStore<EditorStoreState>((set) => ({
    mode: 'edit',
    viewport: 'desktop',
    selectedNodeId: null,
    hoveredNodeId: null,
    leftPanelTab: 'components',
    clipboard: null,
    isDragging: false,
    inspectorOpen: true,

    setMode: (mode) => set({ mode }),
    setViewport: (viewport) => set({ viewport }),
    selectNode: (nodeId) => set({ selectedNodeId: nodeId }),
    hoverNode: (nodeId) => set({ hoveredNodeId: nodeId }),
    setLeftPanelTab: (tab) => set({ leftPanelTab: tab }),
    setClipboard: (data) => set({ clipboard: data }),
    setDragging: (dragging) => set({ isDragging: dragging }),
    setInspectorOpen: (open) => set({ inspectorOpen: open }),
  }));
}
