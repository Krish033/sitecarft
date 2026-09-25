import { createDocumentStore } from '../state/document-store';
import { cloneSubtree } from '../utils/document';
import { copyNode, preparePaste } from '../state/operations';
import type { Node } from '../types/document';

describe('Node Duplication and Subtree Cloning', () => {
  it('duplicates a leaf node and inserts immediately following the original', () => {
    const store = createDocumentStore();
    const rootId = store.getState().document.root;

    const b1 = store.getState().addNode(rootId, 'button');
    const b2 = store.getState().addNode(rootId, 'button');
    expect(store.getState().document.nodes[rootId].children).toEqual([b1.id, b2.id]);

    const dupId = store.getState().duplicateNode(b1.id);
    expect(dupId).toBeTruthy();
    expect(dupId).not.toBe(b1.id);

    const children = store.getState().document.nodes[rootId].children;
    expect(children).toEqual([b1.id, dupId, b2.id]);

    const dupNode = store.getState().document.nodes[dupId!];
    expect(dupNode.type).toBe('button');
  });

  it('deep clones an entire subtree with new IDs for all descendants', () => {
    const store = createDocumentStore();
    const rootId = store.getState().document.root;

    const section = store.getState().addNode(rootId, 'section');
    const container = store.getState().addNode(section.id, 'container');
    const heading = store.getState().addNode(container.id, 'heading');
    store.getState().updateNodeProps(heading.id, { text: 'Subtree Title' });
    const button = store.getState().addNode(container.id, 'button');
    store.getState().updateNodeProps(button.id, { text: 'Subtree Button' });

    const nodes = store.getState().document.nodes;
    const { clonedNodes, newRootId } = cloneSubtree(nodes, section.id);

    // New root should be different
    expect(newRootId).not.toBe(section.id);
    expect(clonedNodes[newRootId]).toBeDefined();
    expect(clonedNodes[newRootId].type).toBe('section');

    // Container should have new ID
    const clonedContainerId = clonedNodes[newRootId].children[0];
    expect(clonedContainerId).toBeDefined();
    expect(clonedContainerId).not.toBe(container.id);
    const clonedContainer = clonedNodes[clonedContainerId];
    expect(clonedContainer.type).toBe('container');

    // Heading and button should have new IDs
    expect(clonedContainer.children.length).toBe(2);
    const [clonedHeadingId, clonedButtonId] = clonedContainer.children;
    expect(clonedHeadingId).not.toBe(heading.id);
    expect(clonedButtonId).not.toBe(button.id);

    const clonedHeading = clonedNodes[clonedHeadingId];
    expect(clonedHeading.props.text).toBe('Subtree Title');

    const clonedButton = clonedNodes[clonedButtonId];
    expect(clonedButton.props.text).toBe('Subtree Button');
  });

  it('copyNode and preparePaste create an independent copy ready for paste', () => {
    const store = createDocumentStore();
    const rootId = store.getState().document.root;

    const section = store.getState().addNode(rootId, 'section');
    const heading = store.getState().addNode(section.id, 'heading');
    store.getState().updateNodeProps(heading.id, { text: 'To Copy' });

    const clipboard = copyNode(store.getState().document.nodes, section.id);
    expect(clipboard).not.toBeNull();
    expect(clipboard!.rootId).toBe(section.id);
    expect(clipboard!.nodes[section.id]).toBeDefined();
    expect(clipboard!.nodes[heading.id]).toBeDefined();

    const { clonedNodes, newRootId } = preparePaste(clipboard!);
    expect(newRootId).not.toBe(section.id);

    // Paste into root
    store.getState().addNodeWithChildren(rootId, clonedNodes[newRootId], clonedNodes);

    const state = store.getState();
    expect(state.document.nodes[rootId].children).toContain(newRootId);
    expect(state.document.nodes[newRootId]).toBeDefined();

    const pastedHeadingId = state.document.nodes[newRootId].children[0];
    expect(pastedHeadingId).not.toBe(heading.id);
    expect(state.document.nodes[pastedHeadingId].props.text).toBe('To Copy');
  });

  it('returns null when attempting to duplicate the root document page', () => {
    const store = createDocumentStore();
    const rootId = store.getState().document.root;
    const result = store.getState().duplicateNode(rootId);
    expect(result).toBeNull();
  });
});
