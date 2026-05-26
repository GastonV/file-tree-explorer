# File Tree Explorer

A modern, interactive hierarchical file explorer built with **Angular 21** and **Angular Material**.

Inspired by IDE file explorers (VS Code, WebStorm), this component supports:

- Hierarchical tree rendering with arbitrary depth
- Expand / collapse folders
- Add new files and folders (inline)
- Rename files and folders (inline)
- Delete files and folders
- Drag & drop to move and reorder
- Colorful file type icons
- State persistence (localStorage)
- Keyboard-friendly interactions

## Features

- Signal-based architecture (modern Angular)
- Fully decoupled service layer (`TreeService`)
- Professional Material Design icons with color coding
- Inline creation and renaming (no modals)
- Path-based creation support ready
- Responsive and accessible tree structure

## Tech Stack

- Angular 21
- Angular Material + CDK (Drag & Drop)
- Signals + Standalone Components
- TypeScript

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## Project Structure

```
src/app/
├── file-tree/                 # Main recursive tree component
├── services/
│   ├── tree.service.ts        # Core business logic (add, delete, rename, move)
│   ├── file.service.ts        # API + persistence layer
│   └── icon.service.ts        # Professional icon mapping
├── models/
│   └── file-node.model.ts
└── app.ts
```

## Demo

> A live demo will be available once deployed.

## Future Improvements

- Path syntax creation (`src/components/Button.tsx`)
- Context menu (right-click)
- Full keyboard navigation
- Virtual scrolling for very large trees

## License

MIT

---

Built as a modern Angular file explorer component.
