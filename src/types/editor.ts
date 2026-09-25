import type { Viewport, Node } from './document';

// ─── Editor Mode ─────────────────────────────────────────────────────────────

export type EditorMode = 'edit' | 'preview';

// ─── Panel Tabs ──────────────────────────────────────────────────────────────

export type LeftPanelTab = 'components' | 'navigator';

// ─── Inspector Sections ──────────────────────────────────────────────────────

export type InspectorSection =
  | 'content'
  | 'style'
  | 'typography'
  | 'spacing'
  | 'layout'
  | 'animation'
  | 'advanced';

// ─── Clipboard ───────────────────────────────────────────────────────────────

export interface ClipboardData {
  /** All nodes in the copied subtree, keyed by their original IDs */
  nodes: Record<string, Node>;
  /** The root node ID of the copied subtree */
  rootId: string;
}

// ─── Drag State ──────────────────────────────────────────────────────────────

export interface DragState {
  isDragging: boolean;
  /** Source: 'sidebar' for new components, 'canvas' for existing nodes */
  source: 'sidebar' | 'canvas' | null;
  /** The type of node being dragged (for sidebar drags) */
  dragNodeType?: string;
  /** The ID of the node being dragged (for canvas drags) */
  dragNodeId?: string;
}

// ─── Component Metadata ─────────────────────────────────────────────────────

export interface ComponentDefinition {
  type: string;
  label: string;
  icon: string;
  category: 'layout' | 'basic';
  /** Whether this component can contain children */
  isContainer: boolean;
  /** Which node types are allowed as children (empty = any) */
  allowedChildren?: string[];
  /** Which node types are allowed as parents (empty = any) */
  allowedParents?: string[];
}

// ─── Node Component Props ────────────────────────────────────────────────────

export interface NodeComponentProps {
  node: Node;
  resolvedStyles: React.CSSProperties;
  isEditor: boolean;
  children?: React.ReactNode;
  onUpdateProps?: (props: Record<string, unknown>) => void;
}
