import { createStore } from 'zustand/vanilla';
import type {
  PageDocument,
  Node,
  NodeType,
  Viewport,
  StyleProperties,
} from '../types/document';
import {
  createDefaultNode,
  createEmptyDocument,
  findParentId,
  collectSubtreeIds,
  cloneSubtree,
} from '../utils/document';

// ─── Store State ─────────────────────────────────────────────────────────────

export interface DocumentStoreState {
  document: PageDocument;
  past: PageDocument[];
  future: PageDocument[];

  // ── Document Replacement (no history) ──────────────────────────────────
  replaceDocument: (doc: PageDocument) => void;

  // ── Node Mutations (with history) ──────────────────────────────────────
  updateNodeProps: (nodeId: string, props: Record<string, unknown>) => void;
  updateNodeStyles: (
    nodeId: string,
    viewport: Viewport,
    styles: Partial<StyleProperties>
  ) => void;
  updateNodeAnimation: (
    nodeId: string,
    animation: Node['animation']
  ) => void;
  updateNodeCustomCss: (nodeId: string, css: string) => void;
  addNode: (parentId: string, type: NodeType, index?: number) => Node;
  addNodeWithChildren: (
    parentId: string,
    rootNode: Node,
    allNodes: Record<string, Node>,
    index?: number
  ) => void;
  removeNode: (nodeId: string) => void;
  moveNode: (nodeId: string, newParentId: string, index: number) => void;
  reorderChildren: (parentId: string, newChildIds: string[]) => void;
  duplicateNode: (nodeId: string) => string | null;

  // ── Theme ──────────────────────────────────────────────────────────────
  updateTheme: (theme: Partial<PageDocument['theme']>) => void;

  // ── Metadata ───────────────────────────────────────────────────────────
  updateMetadata: (meta: Partial<PageDocument['metadata']>) => void;
  updateName: (name: string) => void;

  // ── History ────────────────────────────────────────────────────────────
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const MAX_HISTORY = 50;

// ─── Helper: Push History ────────────────────────────────────────────────────

function pushHistory(
  past: PageDocument[],
  current: PageDocument
): PageDocument[] {
  const newPast = [...past, current];
  if (newPast.length > MAX_HISTORY) {
    return newPast.slice(newPast.length - MAX_HISTORY);
  }
  return newPast;
}

// ─── Store Factory ───────────────────────────────────────────────────────────

export type DocumentStore = ReturnType<typeof createDocumentStore>;

export function createDocumentStore(initialDocument?: PageDocument) {
  const initial = initialDocument ? { ...initialDocument } : createEmptyDocument();
  if (initial.name === 'My Landing Page' || initial.name === 'Untitled Page') {
    initial.name = '';
  }

  return createStore<DocumentStoreState>((set, get) => ({
    document: initial,
    past: [],
    future: [],
    canUndo: false,
    canRedo: false,

    // ── Replace Document (no history — used for external sync) ────────────
    replaceDocument: (doc: PageDocument) => {
      const sanitized = {
        ...doc,
        name: (doc.name === 'My Landing Page' || doc.name === 'Untitled Page') ? '' : doc.name,
      };
      set({
        document: sanitized,
        past: [],
        future: [],
        canUndo: false,
        canRedo: false,
      });
    },

    // ── Update Node Props ────────────────────────────────────────────────
    updateNodeProps: (nodeId: string, props: Record<string, unknown>) => {
      const state = get();
      const node = state.document.nodes[nodeId];
      if (!node) return;

      const newNodes = {
        ...state.document.nodes,
        [nodeId]: {
          ...node,
          props: { ...node.props, ...props },
        },
      };

      set({
        document: { ...state.document, nodes: newNodes },
        past: pushHistory(state.past, state.document),
        future: [],
        canUndo: true,
        canRedo: false,
      });
    },

    // ── Update Node Styles ───────────────────────────────────────────────
    updateNodeStyles: (
      nodeId: string,
      viewport: Viewport,
      styles: Partial<StyleProperties>
    ) => {
      const state = get();
      const node = state.document.nodes[nodeId];
      if (!node) return;

      const currentStyles = node.styles || {};
      const currentViewportStyles = currentStyles[viewport] || {};

      const newNodes = {
        ...state.document.nodes,
        [nodeId]: {
          ...node,
          styles: {
            ...currentStyles,
            [viewport]: { ...currentViewportStyles, ...styles },
          },
        },
      };

      set({
        document: { ...state.document, nodes: newNodes },
        past: pushHistory(state.past, state.document),
        future: [],
        canUndo: true,
        canRedo: false,
      });
    },

    // ── Update Node Animation ────────────────────────────────────────────
    updateNodeAnimation: (nodeId: string, animation: Node['animation']) => {
      const state = get();
      const node = state.document.nodes[nodeId];
      if (!node) return;

      const newNodes = {
        ...state.document.nodes,
        [nodeId]: { ...node, animation },
      };

      set({
        document: { ...state.document, nodes: newNodes },
        past: pushHistory(state.past, state.document),
        future: [],
        canUndo: true,
        canRedo: false,
      });
    },

    // ── Update Node Custom CSS ───────────────────────────────────────────
    updateNodeCustomCss: (nodeId: string, css: string) => {
      const state = get();
      const node = state.document.nodes[nodeId];
      if (!node) return;

      const newNodes = {
        ...state.document.nodes,
        [nodeId]: { ...node, customCss: css },
      };

      set({
        document: { ...state.document, nodes: newNodes },
        past: pushHistory(state.past, state.document),
        future: [],
        canUndo: true,
        canRedo: false,
      });
    },

    // ── Add Node ─────────────────────────────────────────────────────────
    addNode: (parentId: string, type: NodeType, index?: number): Node => {
      const state = get();
      const parent = state.document.nodes[parentId];
      if (!parent) return createDefaultNode(type); // Shouldn't happen

      const newNode = createDefaultNode(type);
      const additionalNodes: Node[] = [];

      // Row gets 2 default columns
      if (type === 'row') {
        const col1 = createDefaultNode('column');
        const col2 = createDefaultNode('column');
        newNode.children = [col1.id, col2.id];
        additionalNodes.push(col1, col2);
      }

      const newNodes = { ...state.document.nodes };
      newNodes[newNode.id] = newNode;
      additionalNodes.forEach((n) => {
        newNodes[n.id] = n;
      });

      const newChildren = [...parent.children];
      const insertIdx = index !== undefined ? index : newChildren.length;
      newChildren.splice(insertIdx, 0, newNode.id);
      newNodes[parentId] = { ...parent, children: newChildren };

      set({
        document: { ...state.document, nodes: newNodes },
        past: pushHistory(state.past, state.document),
        future: [],
        canUndo: true,
        canRedo: false,
      });

      return newNode;
    },

    // ── Add Node with Children (for paste) ───────────────────────────────
    addNodeWithChildren: (
      parentId: string,
      rootNode: Node,
      allNodes: Record<string, Node>,
      index?: number
    ) => {
      const state = get();
      const parent = state.document.nodes[parentId];
      if (!parent) return;

      const newNodes = { ...state.document.nodes, ...allNodes };

      const newChildren = [...parent.children];
      const insertIdx = index !== undefined ? index : newChildren.length;
      newChildren.splice(insertIdx, 0, rootNode.id);
      newNodes[parentId] = { ...parent, children: newChildren };

      set({
        document: { ...state.document, nodes: newNodes },
        past: pushHistory(state.past, state.document),
        future: [],
        canUndo: true,
        canRedo: false,
      });
    },

    // ── Remove Node ──────────────────────────────────────────────────────
    removeNode: (nodeId: string) => {
      const state = get();
      const node = state.document.nodes[nodeId];
      if (!node) return;

      // Can't remove the root page node
      if (nodeId === state.document.root) return;

      // Collect all IDs in the subtree
      const idsToRemove = collectSubtreeIds(state.document.nodes, nodeId);
      const newNodes = { ...state.document.nodes };
      idsToRemove.forEach((id) => delete newNodes[id]);

      // Remove from parent's children
      const parentId = findParentId(state.document.nodes, nodeId);
      if (parentId && newNodes[parentId]) {
        newNodes[parentId] = {
          ...newNodes[parentId],
          children: newNodes[parentId].children.filter((id) => id !== nodeId),
        };
      }

      set({
        document: { ...state.document, nodes: newNodes },
        past: pushHistory(state.past, state.document),
        future: [],
        canUndo: true,
        canRedo: false,
      });
    },

    // ── Move Node ────────────────────────────────────────────────────────
    moveNode: (nodeId: string, newParentId: string, index: number) => {
      const state = get();
      const node = state.document.nodes[nodeId];
      if (!node) return;

      const oldParentId = findParentId(state.document.nodes, nodeId);
      if (!oldParentId) return;

      const newNodes = { ...state.document.nodes };

      // Remove from old parent
      const oldParent = newNodes[oldParentId];
      newNodes[oldParentId] = {
        ...oldParent,
        children: oldParent.children.filter((id) => id !== nodeId),
      };

      // Add to new parent
      const newParent = newNodes[newParentId];
      const newChildren = [...newParent.children];

      // Adjust index if moving within the same parent
      let adjustedIndex = index;
      if (oldParentId === newParentId) {
        const oldIndex = oldParent.children.indexOf(nodeId);
        if (oldIndex < index) {
          adjustedIndex = index - 1;
        }
      }

      newChildren.splice(adjustedIndex, 0, nodeId);
      newNodes[newParentId] = { ...newParent, children: newChildren };

      set({
        document: { ...state.document, nodes: newNodes },
        past: pushHistory(state.past, state.document),
        future: [],
        canUndo: true,
        canRedo: false,
      });
    },

    // ── Reorder Children ─────────────────────────────────────────────────
    reorderChildren: (parentId: string, newChildIds: string[]) => {
      const state = get();
      const parent = state.document.nodes[parentId];
      if (!parent) return;

      const newNodes = {
        ...state.document.nodes,
        [parentId]: { ...parent, children: newChildIds },
      };

      set({
        document: { ...state.document, nodes: newNodes },
        past: pushHistory(state.past, state.document),
        future: [],
        canUndo: true,
        canRedo: false,
      });
    },

    // ── Duplicate Node ───────────────────────────────────────────────────
    duplicateNode: (nodeId: string): string | null => {
      const state = get();
      const node = state.document.nodes[nodeId];
      if (!node) return null;
      if (nodeId === state.document.root) return null;

      const parentId = findParentId(state.document.nodes, nodeId);
      if (!parentId) return null;

      const { clonedNodes, newRootId } = cloneSubtree(
        state.document.nodes,
        nodeId
      );

      const newNodes = { ...state.document.nodes, ...clonedNodes };

      // Insert after the original
      const parent = newNodes[parentId];
      const originalIndex = parent.children.indexOf(nodeId);
      const newChildren = [...parent.children];
      newChildren.splice(originalIndex + 1, 0, newRootId);
      newNodes[parentId] = { ...parent, children: newChildren };

      set({
        document: { ...state.document, nodes: newNodes },
        past: pushHistory(state.past, state.document),
        future: [],
        canUndo: true,
        canRedo: false,
      });

      return newRootId;
    },

    // ── Update Theme ─────────────────────────────────────────────────────
    updateTheme: (themeUpdate: Partial<PageDocument['theme']>) => {
      const state = get();
      const newTheme = {
        ...state.document.theme,
        ...themeUpdate,
        colors: {
          ...state.document.theme.colors,
          ...(themeUpdate.colors || {}),
        },
        fonts: {
          ...state.document.theme.fonts,
          ...(themeUpdate.fonts || {}),
        },
      };

      set({
        document: { ...state.document, theme: newTheme },
        past: pushHistory(state.past, state.document),
        future: [],
        canUndo: true,
        canRedo: false,
      });
    },

    // ── Update Metadata ──────────────────────────────────────────────────
    updateMetadata: (meta: Partial<PageDocument['metadata']>) => {
      const state = get();
      set({
        document: {
          ...state.document,
          metadata: { ...state.document.metadata, ...meta },
        },
      });
    },

    // ── Update Name ──────────────────────────────────────────────────────
    updateName: (name: string) => {
      const state = get();
      set({
        document: { ...state.document, name },
      });
    },

    // ── Undo ─────────────────────────────────────────────────────────────
    undo: () => {
      const state = get();
      if (state.past.length === 0) return;

      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, -1);

      set({
        document: previous,
        past: newPast,
        future: [state.document, ...state.future],
        canUndo: newPast.length > 0,
        canRedo: true,
      });
    },

    // ── Redo ─────────────────────────────────────────────────────────────
    redo: () => {
      const state = get();
      if (state.future.length === 0) return;

      const next = state.future[0];
      const newFuture = state.future.slice(1);

      set({
        document: next,
        past: [...state.past, state.document],
        future: newFuture,
        canUndo: true,
        canRedo: newFuture.length > 0,
      });
    },
  }));
}
