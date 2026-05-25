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