// ═══════════════════════════════════════════════════════════════════════════
// @bcsp/react-site-builder — Public API
// ═══════════════════════════════════════════════════════════════════════════

// ── Main Component ───────────────────────────────────────────────────────
export { SiteBuilder } from './builder/SiteBuilder';

// ── Renderer (for custom rendering outside the builder) ─────────────────
export { NodeRenderer } from './renderer/NodeRenderer';

// ── Document Utilities ───────────────────────────────────────────────────
export { createEmptyDocument, createDefaultNode } from './utils/document';
export { generateId } from './utils/id';

// ── Style Utilities ─────────────────────────────────────────────────────
export {
  resolveStyles,
  VIEWPORT_WIDTHS,
  VIEWPORT_LABELS,
} from './renderer/style-resolver';

// ── Types ────────────────────────────────────────────────────────────────
export type {
  PageDocument,
  Node,
  NodeType,
  Viewport,
  StyleProperties,
  ResponsiveStyles,
  AnimationType,
  AnimationTrigger,
  AnimationConfig,
  Theme,
  PageMetadata,
  Asset,
  BuilderProps,
} from './types/document';

export type { EditorMode, ComponentDefinition } from './types/editor';
