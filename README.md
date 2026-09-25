# @bcsp/react-site-builder

A lightweight, package-first visual page and website builder for React 18 applications. Designed with an Elementor-like developer and editor experience without imposing heavy state management or custom runtimes on the host application.

---

## Features

- **Isolated & Framework-Friendly**: Implemented in TypeScript; usable in any modern JavaScript or TypeScript React 18 project without requiring Zustand, Redux, or any specific state architecture in the host.
- **Structured JSON Document Model**: Clean, serializable, backend-agnostic JSON format for storage and versioning. No unsafe raw HTML or JSX stored as truth.
- **Component Palette**:
  - **Layout**: Section, Container, Row, Column (with auto 2-column scaffolding).
  - **Basic Elements**: Heading, Text, Image, Button, Divider, Spacer, Custom HTML (sanitized).
- **Responsive Editing**: First-class support for Desktop (1280px), Tablet (768px), and Mobile (375px) breakpoints with intuitive inheritance cascading (Desktop → Tablet → Mobile).
- **Freeform & Normal Flow Positioning**: Seamlessly switch between standard document flow and absolute freeform placement (top, left, right, bottom, z-index).
- **Undo / Redo History**: Snapshot-based history stack (up to 50 operations) with full keyboard shortcut support (`Ctrl+Z`, `Ctrl+Shift+Z` / `Cmd+Z`, `Cmd+Shift+Z`).
- **Layers & Navigator Tree**: Real-time layer hierarchy with synchronized two-way selection between canvas and navigator tree.
- **Clipboard & Duplication**: Duplicate single elements or clone deep subtrees with automatic ID regeneration.
- **Integrated Asset Manager**: Reference assets by ID with support for custom media library loaders and uploaders.
- **Draft & Publish Workflows**: Built-in state separation between working drafts and published pages.
- **Lightweight Animations**: CSS-driven entry animations (`fadeIn`, `slideUp`, `slideDown`, `slideLeft`, `slideRight`, `scale`) with duration and delay configuration.

---

## Installation

```bash
npm install @bcsp/react-site-builder
```

### Peer Dependencies

Ensure your host project has React 18:

```json
{
  "peerDependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

---

## Quick Start

Import the builder and its styles in your application:

```tsx
import React, { useState } from 'react';
import {
  SiteBuilder,
  createEmptyDocument,
  type PageDocument,
} from '@bcsp/react-site-builder';
import '@bcsp/react-site-builder/dist/styles.css';

export function VisualEditorPage() {
  const [doc, setDoc] = useState<PageDocument>(() =>
    createEmptyDocument()
  );

  const handleSave = async (savedDoc: PageDocument) => {
    await fetch(`/api/pages/${savedDoc.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(savedDoc),
    });
    alert('Page draft saved!');
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <SiteBuilder
        value={doc}
        onChange={setDoc}
        onSave={handleSave}
      />
    </div>
  );
}
```

---

## Public API Reference

### `<SiteBuilder />` Component Props

| Prop | Type | Description |
|------|------|-------------|
| `value` | `PageDocument` | The current page document state. |
| `onChange` | `(doc: PageDocument) => void` | Invoked whenever the document is modified. |
| `onSave` | `(doc: PageDocument) => Promise<void> \| void` | Callback triggered when the editor "Save" button is clicked. |
| `onPublish` | `(doc: PageDocument) => Promise<void> \| void` | Callback triggered when the editor "Publish" button is clicked. |
| `onClose` | `() => void` | Optional callback when exiting the editor. |
| `assets` | `Asset[]` | Preloaded asset list for media picker. |
| `onUploadAsset` | `(file: File) => Promise<Asset>` | Handler for uploading image / media files. |
| `onSelectAsset` | `() => Promise<Asset \| null>` | Handler to launch host app's asset browser. |
| `theme` | `Theme` | Global brand colors and fonts. |
| `readOnly` | `boolean` | If true, disables editing controls. |

---

## Standalone Public Page Rendering

To render the page on your public-facing site without any editor UI, overlays, or edit state overhead, use `<NodeRenderer />`:

```tsx
import React, { useEffect, useState } from 'react';
import { NodeRenderer, type PageDocument } from '@bcsp/react-site-builder';

export function PublicPage({ pageId }: { pageId: string }) {
  const [doc, setDoc] = useState<PageDocument | null>(null);

  useEffect(() => {
    fetch(`/api/pages/${pageId}`)
      .then((res) => res.json())
      .then((data) => setDoc(data));
  }, [pageId]);

  if (!doc) return <div>Loading...</div>;

  return (
    <div className="site-wrapper">
      <NodeRenderer
        nodeId={doc.root}
        nodes={doc.nodes}
        theme={doc.theme}
        viewport="desktop"
        mode="preview"
      />
    </div>
  );
}
```

---

## Document Model Schema

```ts
interface PageDocument {
  id: string;
  name: string;
  root: string; // ID of the root 'page' node
  nodes: Record<string, Node>;
  theme: Theme;
  metadata?: {
    status?: 'draft' | 'published';
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
    slug?: string;
  };
}

interface Node {
  id: string;
  type: NodeType;
  props: Record<string, unknown>;
  styles?: ResponsiveStyles;
  children: string[];
  animation?: AnimationConfig;
  customCss?: string;
}

type NodeType =
  | 'page'
  | 'section'
  | 'container'
  | 'row'
  | 'column'
  | 'heading'
  | 'text'
  | 'image'
  | 'button'
  | 'divider'
  | 'spacer'
  | 'custom-html';
```

---

## Recommended REST API Endpoints

The package is strictly backend-agnostic. Host applications typically integrate with standard REST endpoints:

- `GET /api/pages` — List all page documents
- `POST /api/pages` — Create a new page document
- `GET /api/pages/:id` — Get document JSON (draft or published)
- `PUT /api/pages/:id` — Update draft document
- `POST /api/pages/:id/publish` — Copy draft state to published state
- `POST /api/pages/:id/duplicate` — Duplicate entire page document
- `POST /api/assets/upload` — Upload media asset and return metadata `{ id, url, name, mimeType }`

---

## License

UNLICENSED — Broward County Public Schools / Proprietary
