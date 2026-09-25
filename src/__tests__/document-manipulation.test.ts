import {
  createEmptyDocument,
  createDefaultNode,
  validateDocument,
  findParentId,
  collectSubtreeIds,
} from '../utils/document';
import { createDocumentStore } from '../state/document-store';
import type { NodeType } from '../types/document';

describe('Document Manipulation', () => {
  describe('createEmptyDocument', () => {
    it('creates a valid empty document with root page node', () => {
      const doc = createEmptyDocument('Test Page');
      expect(doc.id).toBeDefined();
      expect(doc.name).toBe('Test Page');
      expect(doc.root).toBeDefined();
      expect(doc.nodes[doc.root]).toBeDefined();
      expect(doc.nodes[doc.root].type).toBe('page');
      expect(doc.nodes[doc.root].children).toEqual([]);
      expect(doc.theme).toBeDefined();
      expect(doc.metadata?.status).toBe('draft');
    });

    it('passes document validation', () => {
      const doc = createEmptyDocument();
      const errors = validateDocument(doc);
      expect(errors).toEqual([]);
    });
  });

  describe('createDefaultNode', () => {
    const nodeTypes: NodeType[] = [
      'section',
      'container',
      'row',
      'column',
      'heading',
      'text',
      'image',
      'button',
      'divider',
      'spacer',
      'custom-html',
    ];

    nodeTypes.forEach((type) => {
      it(`creates default node for type "${type}"`, () => {
        const node = createDefaultNode(type);
        expect(node.id).toBeDefined();
        expect(node.type).toBe(type);
        expect(node.children).toEqual([]);
        expect(typeof node.props).toBe('object');
      });
    });
  });

  describe('DocumentStore operations', () => {
    it('adds a section node to the root page', () => {
      const store = createDocumentStore();
      const rootId = store.getState().document.root;

      const section = store.getState().addNode(rootId, 'section');
      const state = store.getState();

      expect(state.document.nodes[section.id]).toBeDefined();
      expect(state.document.nodes[rootId].children).toContain(section.id);
      expect(findParentId(state.document.nodes, section.id)).toBe(rootId);
    });

    it('automatically generates two columns when adding a row', () => {
      const store = createDocumentStore();
      const rootId = store.getState().document.root;

      const row = store.getState().addNode(rootId, 'row');
      const state = store.getState();

      expect(row.children.length).toBe(2);
      const col1 = state.document.nodes[row.children[0]];
      const col2 = state.document.nodes[row.children[1]];

      expect(col1).toBeDefined();
      expect(col1.type).toBe('column');
      expect(col2).toBeDefined();
      expect(col2.type).toBe('column');
    });

    it('updates node props without mutating other nodes', () => {
      const store = createDocumentStore();
      const rootId = store.getState().document.root;

      const heading = store.getState().addNode(rootId, 'heading');
      store.getState().updateNodeProps(heading.id, { text: 'Hello World', level: 1 });

      const state = store.getState();
      expect(state.document.nodes[heading.id].props.text).toBe('Hello World');
      expect(state.document.nodes[heading.id].props.level).toBe(1);
    });

    it('updates node styles per viewport', () => {
      const store = createDocumentStore();
      const rootId = store.getState().document.root;

      const heading = store.getState().addNode(rootId, 'heading');
      store.getState().updateNodeStyles(heading.id, 'desktop', { fontSize: '40px', color: '#ff0000' });
      store.getState().updateNodeStyles(heading.id, 'mobile', { fontSize: '24px' });

      const state = store.getState();
      const node = state.document.nodes[heading.id];
      expect(node.styles?.desktop?.fontSize).toBe('40px');
      expect(node.styles?.desktop?.color).toBe('#ff0000');
      expect(node.styles?.mobile?.fontSize).toBe('24px');
    });

    it('removes a node and its entire subtree', () => {
      const store = createDocumentStore();
      const rootId = store.getState().document.root;

      const section = store.getState().addNode(rootId, 'section');
      const heading = store.getState().addNode(section.id, 'heading');

      expect(store.getState().document.nodes[heading.id]).toBeDefined();

      store.getState().removeNode(section.id);

      const state = store.getState();
      expect(state.document.nodes[section.id]).toBeUndefined();
      expect(state.document.nodes[heading.id]).toBeUndefined();
      expect(state.document.nodes[rootId].children).not.toContain(section.id);
    });

    it('moves a node to another container', () => {
      const store = createDocumentStore();
      const rootId = store.getState().document.root;

      const section1 = store.getState().addNode(rootId, 'section');
      const section2 = store.getState().addNode(rootId, 'section');
      const button = store.getState().addNode(section1.id, 'button');

      expect(store.getState().document.nodes[section1.id].children).toContain(button.id);

      store.getState().moveNode(button.id, section2.id, 0);

      const state = store.getState();
      expect(state.document.nodes[section1.id].children).not.toContain(button.id);
      expect(state.document.nodes[section2.id].children[0]).toBe(button.id);
      expect(findParentId(state.document.nodes, button.id)).toBe(section2.id);
    });

    it('reorders children within a parent', () => {
      const store = createDocumentStore();
      const rootId = store.getState().document.root;

      const h1 = store.getState().addNode(rootId, 'heading');
      const h2 = store.getState().addNode(rootId, 'text');
      const h3 = store.getState().addNode(rootId, 'button');

      expect(store.getState().document.nodes[rootId].children).toEqual([h1.id, h2.id, h3.id]);

      store.getState().reorderChildren(rootId, [h3.id, h1.id, h2.id]);

      expect(store.getState().document.nodes[rootId].children).toEqual([h3.id, h1.id, h2.id]);
    });

    it('collects all subtree IDs correctly', () => {
      const store = createDocumentStore();
      const rootId = store.getState().document.root;

      const section = store.getState().addNode(rootId, 'section');
      const container = store.getState().addNode(section.id, 'container');
      const heading = store.getState().addNode(container.id, 'heading');

      const ids = collectSubtreeIds(store.getState().document.nodes, section.id);
      expect(ids).toEqual([section.id, container.id, heading.id]);
    });
  });

  describe('validateDocument error reporting', () => {
    it('detects missing child nodes', () => {
      const doc = createEmptyDocument();
      const root = doc.nodes[doc.root];
      root.children.push('missing-child-id');

      const errors = validateDocument(doc);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain('references missing child "missing-child-id"');
    });

    it('detects missing root node', () => {
      const doc = createEmptyDocument();
      doc.root = 'non-existent-root';

      const errors = validateDocument(doc);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain('Root node "non-existent-root" not found');
    });
  });
});
