export type FileNodeType = 'file' | 'folder';

export interface FileNode {
  id: string;
  name: string;
  type: FileNodeType;
  size?: number; // bytes, optional for folders
  modified?: string; // ISO date string for simplicity (localStorage friendly)
  extension?: string; // e.g. 'ts', 'md' for files
  children?: FileNode[];
  // For UI state (not persisted)
  expanded?: boolean;
}

export interface TreeState {
  nodes: FileNode[];
  lastUpdated: string;
}

// Example types for data coming from the public API (/api/files)
// Matches the documented flat filepaths response format with fallback support
export interface ApiFilesResponse {
  name: string;           // e.g. 'Regular'
  filepaths: string[];    // flat list supporting arbitrary depth, e.g. ['src/app/app.ts', 'README.md', ...]
}

// Optional: strongly-typed example instance for reference in services/components
export const EXAMPLE_API_RESPONSE: ApiFilesResponse = {
  name: 'Regular',
  filepaths: [
    '.editorconfig',
    '.gitignore',
    '.idea/vcs.xml',
    '.prettierrc',
    'README.md',
    'bin/run',
    'bin/run.cmd',
    'package.json',
    'src/commands/benchmark.ts',
    'src/app/app.ts',
    'src/app/app.html'
  ]
};