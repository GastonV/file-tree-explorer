import { Injectable, inject, signal, computed } from '@angular/core';
import { FileNode, TreeState } from '../models/file-node.model';
import { FileService } from './file.service';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TreeService {
  private fileService = inject(FileService);

  private _nodes = signal<FileNode[]>([]);
  readonly nodes = this._nodes.asReadonly();

  readonly loading = signal(true);
  readonly lastUpdated = signal<string | null>(null);

  loadTree(): Observable<FileNode[]> {
    this.loading.set(true);
    return this.fileService.loadTree().pipe(
      tap((nodes) => {
        const sorted = this.sortTree(nodes);
        this._nodes.set(sorted);
        this.loading.set(false);
        this.lastUpdated.set(new Date().toISOString());
      })
    );
  }

  saveTree(): Observable<TreeState> {
    const current = this._nodes();
    return this.fileService.saveTree(this.deepClone(current)).pipe(
      tap((state) => this.lastUpdated.set(state.lastUpdated))
    );
  }

  // === Sorting: Folders first, then files (alphabetically within each) ===
  private sortTree(nodes: FileNode[]): FileNode[] {
    return nodes
      .map(node => {
        if (node.children) {
          node.children = this.sortTree(node.children);
        }
        return node;
      })
      .sort((a, b) => {
        if (a.type === b.type) {
          return a.name.localeCompare(b.name);
        }
        return a.type === 'folder' ? -1 : 1;
      });
  }

  private sortChildren(children: FileNode[]): FileNode[] {
    return [...children].sort((a, b) => {
      if (a.type === b.type) {
        return a.name.localeCompare(b.name);
      }
      return a.type === 'folder' ? -1 : 1;
    });
  }

  moveNode(sourceId: string, targetParentId: string | null, newIndex: number): boolean {
    const nodes = this.deepClone(this._nodes());
    const sourceNode = this.findNodeById(nodes, sourceId);
    if (!sourceNode) return false;

    const removeResult = this.removeNode(nodes, sourceId);
    if (!removeResult) return false;

    let targetChildren: FileNode[];
    if (!targetParentId) {
      targetChildren = nodes;
    } else {
      const targetParent = this.findNodeById(nodes, targetParentId);
      if (!targetParent || targetParent.type !== 'folder') return false;
      targetParent.children = targetParent.children || [];
      targetChildren = targetParent.children;
    }

    targetChildren.splice(Math.max(0, Math.min(newIndex, targetChildren.length)), 0, sourceNode);

    // Re-sort after move
    if (targetParentId) {
      const parent = this.findNodeById(nodes, targetParentId);
      if (parent && parent.children) {
        parent.children = this.sortChildren(parent.children);
      }
    } else {
      // root level
      // nodes array is already sorted below
    }

    this._nodes.set(this.sortTree(nodes));
    return true;
  }

  toggleExpand(nodeId: string): void {
    const nodes = this.deepClone(this._nodes());
    const node = this.findNodeById(nodes, nodeId);
    if (node && node.type === 'folder') {
      node.expanded = !node.expanded;
    }
    this._nodes.set(nodes);
  }

  deleteNode(nodeId: string): boolean {
    const nodes = this.deepClone(this._nodes());
    const success = this.removeNode(nodes, nodeId);
    if (success) {
      this._nodes.set(this.sortTree(nodes));
    }
    return success;
  }

  addNode(parentId: string | null, name: string, type: 'file' | 'folder'): boolean {
    if (!name.trim()) return false;

    const nodes = this.deepClone(this._nodes());
    const newNode: FileNode = {
      id: 'node-' + Date.now(),
      name: name.trim(),
      type: type,
      children: type === 'folder' ? [] : undefined,
      expanded: type === 'folder' ? true : undefined,
      extension: type === 'file' ? name.split('.').pop() : undefined
    };

    if (!parentId) {
      nodes.push(newNode);
    } else {
      const parent = this.findNodeById(nodes, parentId);
      if (!parent || parent.type !== 'folder') return false;
      parent.children = parent.children || [];
      parent.children.push(newNode);
      parent.expanded = true;
      parent.children = this.sortChildren(parent.children);
    }

    this._nodes.set(this.sortTree(nodes));
    return true;
  }

  renameNode(nodeId: string, newName: string): boolean {
    if (!newName.trim()) return false;

    const nodes = this.deepClone(this._nodes());
    const node = this.findNodeById(nodes, nodeId);
    if (!node) return false;

    const trimmedName = newName.trim();
    const parent = this.findParent(nodes, nodeId);
    const siblings = parent ? parent.children || [] : nodes;

    if (siblings.some(s => s.id !== nodeId && s.name === trimmedName)) return false;

    node.name = trimmedName;
    if (node.type === 'file') {
      node.extension = trimmedName.includes('.') ? trimmedName.split('.').pop() : undefined;
    }

    this._nodes.set(this.sortTree(nodes));
    return true;
  }

  private findParent(nodes: FileNode[], childId: string, parent: FileNode | null = null): FileNode | null {
    for (const node of nodes) {
      if (node.id === childId) return parent;
      if (node.children) {
        const found = this.findParent(node.children, childId, node);
        if (found) return found;
      }
    }
    return null;
  }

  private findNodeById(nodes: FileNode[], id: string): FileNode | null {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = this.findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  }

  private removeNode(nodes: FileNode[], id: string): boolean {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].id === id) {
        nodes.splice(i, 1);
        return true;
      }
      if (nodes[i].children && this.removeNode(nodes[i].children!, id)) {
        return true;
      }
    }
    return false;
  }

  private deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }
}
