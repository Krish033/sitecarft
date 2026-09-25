import type {
  PageDocument,
  Node,
  NodeType,
  Theme,
  AnimationConfig,
} from '../types/document';
import { generateId } from './id';

// ─── Default Theme ───────────────────────────────────────────────────────────

export const DEFAULT_THEME: Theme = {
  colors: {
    primary: '#4f7cf7',
    secondary: '#6c63ff',
    background: '#ffffff',
    text: '#1a1a2e',
  },
  fonts: {
    heading: "'Inter', sans-serif",
    body: "'Inter', sans-serif",
  },
};

// ─── Default Animation ──────────────────────────────────────────────────────

export const DEFAULT_ANIMATION: AnimationConfig = {
  type: 'none',
  trigger: 'onLoad',
  duration: 500,
  delay: 0,
};

// ─── Create Empty Document ───────────────────────────────────────────────────

export function createEmptyDocument(name: string = ''): PageDocument {
  const pageId = generateId();
  const cleanName = (name === 'My Landing Page' || name === 'Untitled Page') ? '' : name;
  return {
    id: generateId(),
    name: cleanName,
    root: pageId,
    nodes: {
      [pageId]: {
        id: pageId,
        type: 'page',
        props: {},
        styles: {},
        children: [],
      },
    },
    theme: { ...DEFAULT_THEME },
    metadata: {
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };
}

// ─── Create Default Node ─────────────────────────────────────────────────────

export function createDefaultNode(type: NodeType): Node {
  const id = generateId();
  const base: Node = { id, type, props: {}, styles: {}, children: [] };

  switch (type) {
    case 'section':
      return {
        ...base,
        props: { label: 'Section' },
        styles: {
          desktop: {
            padding: '60px 20px',
            minHeight: '100px',
            position: 'relative',
          },
        },
      };

    case 'container':
      return {
        ...base,
        props: { label: 'Container' },
        styles: {
          desktop: {
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '20px',
          },
        },
      };

    case 'row':
      return {
        ...base,
        props: { label: 'Row' },
        styles: {
          desktop: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
          },
        },
      };

    case 'column':
      return {
        ...base,
        props: { label: 'Column' },
        styles: {
          desktop: {
            flex: '1',
            minWidth: '0',
            padding: '10px',
          },
        },
      };

    case 'heading':
      return {
        ...base,
        props: {
          text: 'Heading',
          level: 2,
        },
        styles: {
          desktop: {
            fontSize: '32px',
            fontWeight: 700,
            lineHeight: '1.3',
            marginBottom: '16px',
          },
        },
      };

    case 'text':
      return {
        ...base,
        props: {
          text: 'Enter your text here. Click to edit this text block and add your content.',
        },
        styles: {
          desktop: {
            fontSize: '16px',
            lineHeight: '1.6',
            marginBottom: '16px',
          },
        },
      };

    case 'image':
      return {
        ...base,
        props: {
          src: '',
          alt: 'Image',
          objectFit: 'cover',
        },
        styles: {
          desktop: {
            width: '100%',
            height: 'auto',
            borderRadius: '8px',
          },
        },
      };

    case 'button':
      return {
        ...base,
        props: {
          text: 'Click Me',
          url: '#',
          variant: 'primary',
        },
        styles: {
          desktop: {
            padding: '12px 32px',
            fontSize: '16px',
            fontWeight: 600,
            borderRadius: '6px',
            border: 'none',
            backgroundColor: '#4f7cf7',
            color: '#ffffff',
          },
        },
      };

    case 'divider':
      return {
        ...base,
        props: {
          lineStyle: 'solid',
          thickness: '1px',
          color: '#e0e0e0',
        },
        styles: {
          desktop: {
            margin: '24px 0',
          },
        },
      };

    case 'spacer':
      return {
        ...base,
        props: {
          height: '40px',
        },
      };

    case 'custom-html':
      return {
        ...base,
        props: {
          html: '<div style="padding: 20px; background: #f5f5f5; border-radius: 8px;">Custom HTML Block</div>',
          css: '',
        },
      };

    default:
      return base;
  }
}

// ─── Clone Subtree ───────────────────────────────────────────────────────────

/**
 * Deep-clone a subtree of nodes, assigning new IDs to every node.
 * Returns the new nodes map and the new root ID.
 */
export function cloneSubtree(
  nodes: Record<string, Node>,
  rootId: string
): { clonedNodes: Record<string, Node>; newRootId: string } {
  const idMap = new Map<string, string>();
  const clonedNodes: Record<string, Node> = {};

  // First pass: generate new IDs for all nodes in the subtree
  function collectIds(nodeId: string) {
    if (!nodes[nodeId]) return;
    const newId = generateId();
    idMap.set(nodeId, newId);
    nodes[nodeId].children.forEach(collectIds);
  }

  collectIds(rootId);

  // Second pass: clone nodes with new IDs and updated children references
  function cloneNode(nodeId: string) {
    const original = nodes[nodeId];
    if (!original) return;

    const newId = idMap.get(nodeId)!;
    const cloned: Node = {
      ...original,
      id: newId,
      props: { ...original.props },
      styles: original.styles ? JSON.parse(JSON.stringify(original.styles)) : undefined,
      children: original.children
        .map((childId) => idMap.get(childId))
        .filter((id): id is string => id !== undefined),
      animation: original.animation ? { ...original.animation } : undefined,
      customCss: original.customCss,
    };

    clonedNodes[newId] = cloned;
    original.children.forEach(cloneNode);
  }

  cloneNode(rootId);

  return {
    clonedNodes,
    newRootId: idMap.get(rootId)!,
  };
}

// ─── Find Parent ─────────────────────────────────────────────────────────────

/**
 * Find the parent node ID of a given node.
 * Returns null if the node is the root or not found.
 */
export function findParentId(
  nodes: Record<string, Node>,
  targetId: string
): string | null {
  for (const [nodeId, node] of Object.entries(nodes)) {
    if (node.children.includes(targetId)) {
      return nodeId;
    }
  }
  return null;
}

// ─── Collect Subtree IDs ─────────────────────────────────────────────────────

/**
 * Collect all node IDs in a subtree (including the root).
 */
export function collectSubtreeIds(
  nodes: Record<string, Node>,
  rootId: string
): string[] {
  const ids: string[] = [];

  function collect(nodeId: string) {
    if (!nodes[nodeId]) return;
    ids.push(nodeId);
    nodes[nodeId].children.forEach(collect);
  }

  collect(rootId);
  return ids;
}

// ─── Validate Document ──────────────────────────────────────────────────────

/**
 * Basic validation of a PageDocument.
 * Returns an array of error messages (empty = valid).
 */
export function validateDocument(doc: PageDocument): string[] {
  const errors: string[] = [];

  if (!doc.id) errors.push('Document missing id');
  if (!doc.root) errors.push('Document missing root');
  if (!doc.nodes) errors.push('Document missing nodes');

  if (doc.root && !doc.nodes[doc.root]) {
    errors.push(`Root node "${doc.root}" not found in nodes`);
  }

  // Check for orphaned children references
  for (const [nodeId, node] of Object.entries(doc.nodes || {})) {
    for (const childId of node.children) {
      if (!doc.nodes[childId]) {
        errors.push(`Node "${nodeId}" references missing child "${childId}"`);
      }
    }
  }

  return errors;
}
