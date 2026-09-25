# SiteCraft

> A lightweight, extensible visual site builder for React.

SiteCraft is a React-based visual page builder designed to make it easy to create responsive web pages through a drag-and-drop editor.

It provides a structured page document model, visual editing, responsive styling, reusable layout components, and an editor experience inspired by tools such as Elementor — while keeping the underlying architecture simple and developer-friendly.

> **Status: Early Development / Phase 1**
>
> SiteCraft is currently under active development. APIs, document structures, and features may change.

---

## ✨ Features

### Visual Editor

- Drag-and-drop page building
- Visual canvas
- Component selection
- Component reordering
- Layer / navigator tree
- Property inspector
- Duplicate components
- Copy / paste
- Delete components

### Layout

- Sections
- Containers
- Rows
- Columns
- Flexbox-based layouts
- Basic freeform positioning

### Components

Phase 1 includes:

- Heading
- Text
- Image
- Button
- Divider
- Spacer
- Section
- Container
- Row
- Column

More components will be added as the project evolves.

### Responsive Editing

Edit pages for:

- Desktop
- Tablet
- Mobile

Styles can be overridden at each breakpoint.

### Styling

SiteCraft supports structured styling for properties such as:

- Typography
- Colors
- Spacing
- Dimensions
- Borders
- Border radius
- Shadows
- Positioning
- Layout

### Editor History

- Undo
- Redo
- Keyboard shortcuts
- Document history

### Preview

SiteCraft uses the same page renderer for both editing and previewing, helping ensure that the page users build is the page they preview.

### Assets

Planned/initial asset support includes:

- Image uploads
- SVG
- Video
- Media library
- Asset selection
- Image URLs

---

## 🏗️ Architecture

SiteCraft is designed as a reusable React package rather than being tightly coupled to a specific application.

```text
┌──────────────────────────────┐
│       React Application      │
│                              │
│   ┌──────────────────────┐   │
│   │       SiteCraft       │   │
│   │                      │   │
│   │  Canvas              │   │
│   │  Inspector           │   │
│   │  Navigator           │   │
│   │  Components          │   │
│   │  Renderer            │   │
│   │  History             │   │
│   └──────────────────────┘   │
│              │               │
│              ▼               │
│       Page Document          │
│                              │
└──────────────┬───────────────┘
               │
               ▼
          Application API
               │
               ▼
            Database
```

The builder itself should remain independent from the application's backend and business logic.

---

## 📄 Document Model

SiteCraft does not use generated JSX or HTML as its source of truth.

Pages are represented using a structured JSON document.

Example:

```json
{
  "id": "page_001",
  "name": "Homepage",
  "root": "node_001",
  "nodes": {
    "node_001": {
      "id": "node_001",
      "type": "page",
      "props": {},
      "children": ["node_002"]
    },
    "node_002": {
      "id": "node_002",
      "type": "section",
      "props": {},
      "children": ["node_003"]
    },
    "node_003": {
      "id": "node_003",
      "type": "heading",
      "props": {
        "text": "Welcome to SiteCraft"
      },
      "children": []
    }
  }
}
```

This approach keeps the document:

- Serializable
- Database-friendly
- Versionable
- Portable
- Independent from React rendering

---

## 🧩 Package Usage

SiteCraft is designed to be consumed as a React package.

```jsx
import { SiteCraft } from "sitecraft";

function BuilderPage() {
  return <SiteCraft />;
}
```

A document can be supplied and controlled by the host application:

```jsx
import { SiteCraft } from "sitecraft";

function BuilderPage({ page }) {
  return (
    <SiteCraft
      value={page}
      onChange={(document) => {
        console.log(document);
      }}
    />
  );
}
```

The host application remains responsible for persistence.

For example:

```jsx
<SiteCraft
  value={page}
  onChange={setPage}
  onSave={savePage}
/>
```

This allows SiteCraft to work with any backend or persistence layer.

---

## 🔌 Backend Integration

SiteCraft is intentionally backend-agnostic.

A consuming application can connect it to:

- REST APIs
- GraphQL
- MongoDB
- PostgreSQL
- Firebase
- Other persistence systems

A typical setup might look like:

```text
SiteCraft
    │
    │ PageDocument
    ▼
React Application
    │
    │ REST API
    ▼
Backend
    │
    ▼
MongoDB
```

SiteCraft itself should not directly depend on MongoDB.

---

## 🛠️ Development

Clone the repository:

```bash
git clone <repository-url>
cd react-site-builder
```

Install dependencies:

```bash
npm install
```

Run the development environment:

```bash
npm start
```

Build the package:

```bash
npm run build
```

Run tests:

```bash
npm test
```

---

## 📦 Local Development

SiteCraft can be used locally without publishing it to npm.

For example, with:

```text
project/
├── react-site-builder/
└── client/
```

The `client` application can reference the local package:

```json
{
  "dependencies": {
    "sitecraft": "file:../react-site-builder"
  }
}
```

Then run:

```bash
cd client
npm install
```

The package can then be imported normally:

```jsx
import { SiteCraft } from "sitecraft";
```

---

## 🧱 Project Structure

The project is organized around the core editor responsibilities:

```text
src/
├── builder/
├── canvas/
├── components/
├── inspector/
├── navigator/
├── renderer/
├── history/
├── assets/
├── responsive/
├── state/
├── styles/
├── types/
└── index.ts
```

### Core areas

| Directory | Responsibility |
|---|---|
| `builder` | Main editor orchestration |
| `canvas` | Visual editing surface |
| `components` | Site-building components |
| `inspector` | Component property editing |
| `navigator` | Layer/tree navigation |
| `renderer` | Page rendering |
| `history` | Undo/redo |
| `assets` | Asset management |
| `responsive` | Breakpoint handling |
| `state` | Editor state |
| `styles` | Style resolution |
| `types` | Shared TypeScript types |

---

## 🎯 Phase 1 Scope

The initial goal is to create a small, reliable visual builder rather than a full Elementor replacement.

### Included

- [x] React-based editor
- [x] Structured page document
- [x] Drag-and-drop
- [x] Basic layout components
- [x] Basic content components
- [x] Responsive editing
- [x] Basic freeform positioning
- [x] Inspector
- [x] Navigator
- [x] Undo/redo
- [x] Copy/paste
- [x] Duplicate
- [x] Preview
- [x] Basic animations
- [x] Custom CSS
- [x] Basic custom HTML
- [x] Asset integration

### Not currently in scope

- [ ] Collaborative editing
- [ ] Figma-style infinite canvas
- [ ] Animation timeline
- [ ] Arbitrary JavaScript execution
- [ ] Custom React component marketplace
- [ ] Plugin marketplace
- [ ] Advanced design-token management
- [ ] Large-scale page optimization
- [ ] AI page generation

The scope may expand after the core editor architecture stabilizes.

---

## 🗺️ Roadmap

### Phase 1 — Core Builder

Build the foundation:

- Document model
- Canvas
- Components
- Drag/drop
- Inspector
- Navigator
- Responsive editing
- History
- Preview
- Basic asset support

### Phase 2 — Expanded Editing

Potential additions:

- More components
- Better freeform controls
- Advanced responsive controls
- Global styles
- Templates
- Reusable blocks
- Improved animations

### Phase 3 — Platform Features

Potential future features:

- Custom component registration
- Plugin architecture
- Advanced asset management
- Version history
- Collaboration
- Advanced interactions
- Additional integrations

---

## 🤝 Contributing

SiteCraft is currently in early development.

Contributions, ideas, bug reports, and architectural discussions are welcome.

Before submitting a large change, please open an issue to discuss the proposed approach.

---

## 👨‍💻 Author

<p align="center">
  <img src="https://avatars.githubusercontent.com/u/67096785?s=400&u=18fa4e8a6345df8b3ee866127abd0fe6724d1b56&v=4" width="120" height="120" style="border-radius: 50%; max-width: 100%;" alt="Sri Krishna" /><br />
  <strong>Sri Krishna</strong><br />
  <sub>Creator & Maintainer of SiteCraft</sub>
</p>

<p align="center">
  <a href="https://krish033.online" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/Portfolio-krish033.online-2563EB?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Portfolio" />
  </a>
  <a href="https://github.com/Krish033" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/GitHub-Krish033-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
  <a href="https://linkedin.com/in/sri-krishna-642981126" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/LinkedIn-Sri_Krishna-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>
  <a href="https://www.fiverr.com/s/WE4rBzd" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/Fiverr-Hire_Me-1DBF73?style=for-the-badge&logo=fiverr&logoColor=white" alt="Fiverr" />
  </a>
</p>

- 🌐 **Portfolio**: [krish033.online](https://krish033.online)
- 🐙 **GitHub**: [@Krish033](https://github.com/Krish033)
- 💼 **LinkedIn**: [Sri Krishna](https://linkedin.com/in/sri-krishna-642981126)
- 🟢 **Fiverr**: [Hire me on Fiverr](https://www.fiverr.com/s/WE4rBzd)

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

## 🚧 Project Status

SiteCraft is currently a work in progress.

The architecture and APIs are expected to evolve during Phase 1.

The primary goal is to establish a clean, reusable foundation for a React visual site builder before expanding the feature set.

---

**SiteCraft** — Build visually. Keep the code clean.
