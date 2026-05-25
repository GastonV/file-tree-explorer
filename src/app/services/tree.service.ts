import { Injectable, inject, signal, computed } from '@angular/core';
import { FileNode, TreeState } from '../models/file-node.model';
import { FileService } from './file.service';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TreeService {
  private fileService = inject(FileService);

  // Core decoupled state - single source of truth
  private _nodes = signal<FileNode[]>([]);
  readonly nodes = this._nodes.asReadonly();

  readonly loading = signal(true);
  readonly lastUpdated = signal<string | null>(null);

  // Computed: flattened map for quick lookups (decouples path/node finding)
  private nodeMap = computed(() => {
    const map = new Map<string, FileNode>();
    const traverse = (nodes: FileNode[]) => {
      for (const node of nodes) {
        map.set(node.id, node);
        if (node.children) traverse(node.children);
      }
    };
    traverse(this._nodes());
    return map;
  });

  // Get full relative path for any node (supports arbitrary depth)
  getFullPath(nodeId: string): string {
    const buildPath = (id: string): string => {
      const node = this.nodeMap().get(id);
      if (!node) return '';
      // Note: In real impl, we'd track parentIds; here we recompute via search (optimize later)
      // For simplicity in this refactor, assume called with context or enhance model
      return node.name; // Placeholder - enhanced in component or with parent tracking
    };
    return buildPath(nodeId);
  }

  // Load tree - delegates to FileService (decoupled persistence)
  loadTree(): Observable<FileNode[]> {
    this.loading.set(true);
    return this.fileService.loadTree().pipe(
      tap((nodes) => {
        this._nodes.set(this.deepClone(nodes)); // immutable
        this.loading.set(false);
        this.lastUpdated.set(new Date().toISOString());
      })
    );
  }

  // Save via FileService
  saveTree(): Observable<TreeState> {
    const current = this._nodes();
    return this.fileService.saveTree(this.deepClone(current)).pipe(
      tap((state) => this.lastUpdated.set(state.lastUpdated))
    );
  }

  // Core business op: move/reorder - fully decoupled from UI
  moveNode(sourceId: string, targetParentId: string | null, newIndex: number): boolean {
    const nodes = this.deepClone(this._nodes());
    const sourceNode = this.findNodeById(nodes, sourceId);
    if (!sourceNode) return false;

    // Remove from current location
    const removeResult = this.removeNode(nodes, sourceId);
    if (!removeResult) return false;

    // Find target parent or root
    let targetChildren: FileNode[];
    if (!targetParentId) {
      targetChildren = nodes;
    } else {
      const targetParent = this.findNodeById(nodes, targetParentId);
      if (!targetParent || targetParent.type !== 'folder') return false;
      targetParent.children = targetParent.children || [];
      targetChildren = targetParent.children;
    }

    // Insert at new position (reorder within or across)
    targetChildren.splice(Math.max(0, Math.min(newIndex, targetChildren.length)), 0, sourceNode);

    this._nodes.set(nodes);
    return true;
  }

  toggleExpand(nodeId: string): void {
    const nodes = this.deepClone(this._nodes());
    const node = this.findNodeById(nodes, nodeId);
    if (node && node.type === 'folder') {
      node.expanded = !node.expanded;
      this._nodes.set(nodes);
    }
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
