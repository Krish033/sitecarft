# SiteCraft

<p align="center">
  <a href="https://www.npmjs.com/package/@krish033/sitecraft"><img src="https://img.shields.io/npm/v/@krish033/sitecraft?color=blue&style=flat-square" alt="npm version" /></a>
  <a href="https://github.com/Krish033/sitecarft/blob/master/packages/sitecraft/LICENSE"><img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License" /></a>
  <img src="https://img.shields.io/badge/react-^18.2.0-61dafb?style=flat-square&logo=react" alt="React 18" />
  <img src="https://img.shields.io/badge/typescript-5.4-3178c6?style=flat-square&logo=typescript" alt="TypeScript" />
</p>

> A lightweight, extensible visual site builder for React applications.

**SiteCraft** provides a structured document model, drag-and-drop visual editing, responsive breakpoint styling, and reusable layout components — giving you a clean, developer-friendly page builder inspired by modern visual tools without tying you to any specific backend.

---

## ✨ Features

- 🎨 **Visual Drag & Drop**: Intuitive canvas powered by `@dnd-kit` for reordering and nesting components.
- 📐 **Responsive Layouts**: Design for Desktop, Tablet, and Mobile with per-breakpoint style overrides.
- 🌳 **Layer Tree / Navigator**: Full hierarchy inspection and tree-based node selection.
- ⚙️ **Property Inspector**: Granular controls for typography, spacing, flexbox, borders, shadows, and animations.
- 🔄 **Undo / Redo History**: Full state history with keyboard shortcuts (`Cmd/Ctrl+Z`, `Cmd/Ctrl+Y`).
- 👁️ **Live Preview Mode**: Seamless toggle between editor and clean live preview.
- 📄 **JSON Document Model**: Clean, serializable, database-agnostic JSON format.
- 🚀 **Standalone Renderer**: Fast `<NodeRenderer />` component to display pages on your public site without editor overhead.

---

## 📦 Installation

```bash
npm install @krish033/sitecraft
```

Make sure peer dependencies are installed:

```bash
npm install react react-dom
```

---

## 🚀 Quick Start

### Visual Editor

Import the `SiteBuilder` component along with the CSS stylesheet:

```tsx
import React, { useState } from 'react';
import { SiteBuilder, type PageDocument, createEmptyDocument } from '@krish033/sitecraft';
import '@krish033/sitecraft/dist/styles.css';

export function EditorPage() {
  const [document, setDocument] = useState<PageDocument>(() => createEmptyDocument());

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <SiteBuilder
        initialDocument={document}
        onChange={(updatedDoc) => setDocument(updatedDoc)}
        onSave={(doc) => {
          console.log('Saving document:', doc);
          // Persist to your backend API / database
        }}
      />
    </div>
  );
}
```

### Public Page Rendering

To render saved pages on your public-facing site without any editor UI or overhead, use `<NodeRenderer />`:

```tsx
import React from 'react';
import { NodeRenderer, type PageDocument } from '@krish033/sitecraft';
import '@krish033/sitecraft/dist/styles.css';

export function PublicPage({ doc }: { doc: PageDocument }) {
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

## 📄 Document Model

SiteCraft represents pages as a clean, serializable JSON tree:

```json
{
  "id": "page_001",
  "name": "Home Page",
  "root": "node_root",
  "nodes": {
    "node_root": {
      "id": "node_root",
      "type": "page",
      "props": {},
      "children": ["section_1"]
    },
    "section_1": {
      "id": "section_1",
      "type": "section",
      "props": {},
      "styles": {
        "desktop": { "padding": "40px 20px" }
      },
      "children": ["heading_1"]
    },
    "heading_1": {
      "id": "heading_1",
      "type": "heading",
      "props": { "text": "Welcome to SiteCraft", "level": 1 },
      "children": []
    }
  }
}
```

---

## 🧱 Built-in Components

| Category | Components |
|---|---|
| **Structure & Layout** | `Section`, `Container`, `Row`, `Column` |
| **Typography & Content**| `Heading`, `Text`, `Image`, `Button` |
| **Utilities** | `Divider`, `Spacer`, `Custom HTML` |

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
