import type { Node } from '../types/document';
import type { ClipboardData } from '../types/editor';
import { cloneSubtree, findParentId } from '../utils/document';

// ─── Copy ────────────────────────────────────────────────────────────────────

/**
 * Build clipboard data for a node and its complete subtree.
 */
export function copyNode(
  nodes: Record<string, Node>,
  nodeId: string
): ClipboardData | null {
  const node = nodes[nodeId];
  if (!node) return null;

  // Collect the subtree
  const subtreeNodes: Record<string, Node> = {};

  function collect(id: string) {
    const n = nodes[id];
    if (!n) return;
    subtreeNodes[id] = JSON.parse(JSON.stringify(n));
    n.children.forEach(collect);
  }

  collect(nodeId);

  return {
    nodes: subtreeNodes,
    rootId: nodeId,
  };
}

// ─── Paste ───────────────────────────────────────────────────────────────────

/**
 * Prepare pasted nodes by cloning them with new IDs.
 * Returns the cloned nodes and the new root ID.
 */
export function preparePaste(
  clipboard: ClipboardData
): { clonedNodes: Record<string, Node>; newRootId: string } {
  return cloneSubtree(clipboard.nodes, clipboard.rootId);
}
