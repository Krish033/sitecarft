import { createDocumentStore } from '../state/document-store';
import { createEmptyDocument } from '../utils/document';

describe('Undo / Redo History', () => {
  it('starts with empty past and future', () => {
    const store = createDocumentStore();
    const state = store.getState();
    expect(state.canUndo).toBe(false);
    expect(state.canRedo).toBe(false);
    expect(state.past).toEqual([]);
    expect(state.future).toEqual([]);
  });

  it('records history when nodes are added and allows undo', () => {
    const store = createDocumentStore();
    const rootId = store.getState().document.root;

    const section = store.getState().addNode(rootId, 'section');
    expect(store.getState().canUndo).toBe(true);
    expect(store.getState().canRedo).toBe(false);
    expect(store.getState().document.nodes[section.id]).toBeDefined();

    store.getState().undo();
    expect(store.getState().canUndo).toBe(false);
    expect(store.getState().canRedo).toBe(true);
    expect(store.getState().document.nodes[section.id]).toBeUndefined();
    expect(store.getState().document.nodes[rootId].children).toEqual([]);

    store.getState().redo();
    expect(store.getState().canUndo).toBe(true);
    expect(store.getState().canRedo).toBe(false);
    expect(store.getState().document.nodes[section.id]).toBeDefined();
    expect(store.getState().document.nodes[rootId].children).toContain(section.id);
  });

  it('allows multiple undos and redos in sequence', () => {
    const store = createDocumentStore();
    const rootId = store.getState().document.root;

    const heading = store.getState().addNode(rootId, 'heading');
    store.getState().updateNodeProps(heading.id, { text: 'Title 1' });
    store.getState().updateNodeProps(heading.id, { text: 'Title 2' });
    store.getState().updateNodeProps(heading.id, { text: 'Title 3' });

    expect(store.getState().document.nodes[heading.id].props.text).toBe('Title 3');

    store.getState().undo();
    expect(store.getState().document.nodes[heading.id].props.text).toBe('Title 2');

    store.getState().undo();
    expect(store.getState().document.nodes[heading.id].props.text).toBe('Title 1');

    store.getState().redo();
    expect(store.getState().document.nodes[heading.id].props.text).toBe('Title 2');

    store.getState().redo();
    expect(store.getState().document.nodes[heading.id].props.text).toBe('Title 3');
  });

  it('clears future when a new action is performed after undo', () => {
    const store = createDocumentStore();
    const rootId = store.getState().document.root;

    const heading = store.getState().addNode(rootId, 'heading');
    store.getState().updateNodeProps(heading.id, { text: 'First' });
    store.getState().undo();
    expect(store.getState().canRedo).toBe(true);

    // Perform new mutation
    store.getState().updateNodeProps(heading.id, { text: 'Divergent Branch' });
    expect(store.getState().canRedo).toBe(false);
    expect(store.getState().future).toEqual([]);
    expect(store.getState().document.nodes[heading.id].props.text).toBe('Divergent Branch');
  });

  it('caps history at maximum limit of 50 items', () => {
    const store = createDocumentStore();
    const rootId = store.getState().document.root;
    const heading = store.getState().addNode(rootId, 'heading');

    // Run 60 mutations
    for (let i = 0; i < 60; i++) {
      store.getState().updateNodeProps(heading.id, { text: `Step ${i}` });
    }

    expect(store.getState().past.length).toBeLessThanOrEqual(50);
  });

  it('replaceDocument clears history without creating undo steps', () => {
    const store = createDocumentStore();
    const rootId = store.getState().document.root;
    store.getState().addNode(rootId, 'section');
    expect(store.getState().canUndo).toBe(true);

    const freshDoc = createEmptyDocument('Replaced Page');
    store.getState().replaceDocument(freshDoc);

    expect(store.getState().document.name).toBe('Replaced Page');
    expect(store.getState().canUndo).toBe(false);
    expect(store.getState().canRedo).toBe(false);
    expect(store.getState().past).toEqual([]);
    expect(store.getState().future).toEqual([]);
  });
});
