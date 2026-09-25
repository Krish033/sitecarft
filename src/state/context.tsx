import React, { createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand';
import type { DocumentStore, DocumentStoreState } from './document-store';
import type { EditorStore, EditorStoreState } from './editor-store';

// ─── Context ─────────────────────────────────────────────────────────────────

interface BuilderContextValue {
  documentStore: DocumentStore;
  editorStore: EditorStore;
}

const BuilderContext = createContext<BuilderContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

interface BuilderProviderProps {
  documentStore: DocumentStore;
  editorStore: EditorStore;
  children: React.ReactNode;
}

export function BuilderProvider({
  documentStore,
  editorStore,
  children,
}: BuilderProviderProps) {
  return (
    <BuilderContext.Provider value={{ documentStore, editorStore }}>
      {children}
    </BuilderContext.Provider>
  );
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

function useBuilderContext(): BuilderContextValue {
  const ctx = useContext(BuilderContext);
  if (!ctx) {
    throw new Error(
      'useDocument/useEditor must be used within a SiteBuilder component'
    );
  }
  return ctx;
}

/**
 * Subscribe to a slice of the document store.
 */
export function useDocumentStore<T>(
  selector: (state: DocumentStoreState) => T
): T {
  const { documentStore } = useBuilderContext();
  return useStore(documentStore, selector);
}

/**
 * Subscribe to a slice of the editor store.
 */
export function useEditorStore<T>(
  selector: (state: EditorStoreState) => T
): T {
  const { editorStore } = useBuilderContext();
  return useStore(editorStore, selector);
}

/**
 * Get the raw document store instance for imperative operations.
 */
export function useDocumentStoreApi(): DocumentStore {
  const { documentStore } = useBuilderContext();
  return documentStore;
}

/**
 * Get the raw editor store instance for imperative operations.
 */
export function useEditorStoreApi(): EditorStore {
  const { editorStore } = useBuilderContext();
  return editorStore;
}
