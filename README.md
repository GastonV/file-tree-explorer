# File Tree Explorer

A modern, interactive, and IDE-style file tree component built with **Angular 21**.

[![Angular](https://img.shields.io/badge/Angular-21-red?logo=angular)](https://angular.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Overview

**File Tree Explorer** provides a clean, hierarchical file and folder interface similar to VS Code or WebStorm. It supports full file management operations with a smooth user experience, including inline editing, drag & drop, and colorful file icons.

The project is built using modern Angular practices (signals, standalone components) and is designed to be reusable and easy to integrate.

## Features

- Hierarchical tree with unlimited nesting
- Expand / collapse folders
- **Inline creation** of files and folders
- **Inline renaming** with validation
- Delete files and folders
- Drag & drop to move and reorder items
- Color-coded file type icons (TypeScript, HTML, CSS, etc.)
- State persistence using localStorage
- Keyboard-friendly interactions
- Error handling with user feedback
- Responsive and accessible design

## Tech Stack

- **Angular 21** (Signals + Standalone Components)
- **Angular Material** + CDK Drag & Drop
- TypeScript
- SCSS

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/GastonV/file-tree-explorer.git
cd file-tree-explorer

# Install dependencies
npm install

# Start development server
npm start
```

The app will be available at `http://localhost:4200`.

### Build

```bash
npm run build
```

The production build will be located in the `dist/` folder.

### Run Tests

```bash
npm test
```

## Project Structure

```
src/app/
├── file-tree/                 # Recursive tree component
├── services/
│   ├── tree.service.ts        # Core logic (add, delete, rename, move)
│   ├── file.service.ts        # Persistence & API layer
│   └── icon.service.ts        # File type icon mapping
├── models/
│   └── file-node.model.ts
└── app.ts
```

## Demo

> A live demo will be added once deployed to GitHub Pages.

## Roadmap / Future Improvements

- Path-based creation (`src/app/Button.tsx`)
- Right-click context menu
- Full keyboard navigation
- Virtual scrolling for large trees
- Multi-selection support

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License.

---

Built with ❤️ using Angular 21.
