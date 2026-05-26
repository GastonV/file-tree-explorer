import { Component, inject, input, output, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';

import { FileNode } from '../models/file-node.model';
import { TreeService } from '../services/tree.service';
import { IconService } from '../services/icon.service';

@Component({
  selector: 'app-file-tree',
  standalone: true,
  imports: [CommonModule, DragDropModule, MatIconModule],
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.scss']
})
export class FileTreeComponent {
  nodes = input<FileNode[]>([]);
  treeChanged = output<void>();

  private treeService = inject(TreeService);
  private iconService = inject(IconService);

  renamingNodeId = signal<string | null>(null);
  renameValue = signal<string>('');

  // Creating state
  creatingInParentId = signal<string | null>(null);
  creatingType = signal<'file' | 'folder' | null>(null);
  newItemName = signal<string>('');

  // Selection
  selectedNodeId = signal<string | null>(null);

  // Keyboard shortcuts
  @HostListener('document:keydown', ['$event'])
  handleKeyboardShortcuts(event: KeyboardEvent) {
    const selectedId = this.selectedNodeId();

    if (event.key === 'F2' && selectedId) {
      event.preventDefault();
      const node = this.findNodeById(this.nodes(), selectedId);
      if (node) this.startRename(node);
    }

    if (event.key === 'Delete' && selectedId) {
      event.preventDefault();
      const node = this.findNodeById(this.nodes(), selectedId);
      if (node) {
        if (confirm(`Delete "${node.name}"?`)) {
          if (this.treeService.deleteNode(selectedId)) {
            this.treeChanged.emit();
            this.selectedNodeId.set(null);
          }
        }
      }
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

  drop(event: CdkDragDrop<FileNode[]>) {
    const draggedNode = event.item.data as FileNode;
    if (!draggedNode) return;

    const targetElement = document.elementFromPoint(
      (event.event as MouseEvent).clientX,
      (event.event as MouseEvent).clientY
    );

    const targetFolderId = this.findNearestFolderId(targetElement);

    if (targetFolderId === draggedNode.id) return;

    const success = this.treeService.moveNode(draggedNode.id, targetFolderId, event.currentIndex);
    if (success) this.treeChanged.emit();
  }

  private findNearestFolderId(element: Element | null): string | null {
    while (element) {
      const folderId = element.getAttribute('data-folder-id');
      if (folderId) return folderId;
      element = element.parentElement;
    }
    return null;
  }

  toggleExpand(node: FileNode) {
    this.treeService.toggleExpand(node.id);
    this.treeChanged.emit();
  }

  deleteNode(node: FileNode, event: Event) {
    event.stopPropagation();
    if (confirm(`Delete "${node.name}"?`)) {
      if (this.treeService.deleteNode(node.id)) {
        this.treeChanged.emit();
        if (this.selectedNodeId() === node.id) this.selectedNodeId.set(null);
      }
    }
  }

  startCreating(parentId: string | null, type: 'file' | 'folder', event?: Event) {
    if (event) event.stopPropagation();
    this.creatingInParentId.set(parentId);
    this.creatingType.set(type);
    this.newItemName.set('');
  }

  confirmCreate() {
    const parentId = this.creatingInParentId();
    const type = this.creatingType();
    const name = this.newItemName();

    if (!name.trim() || !type) {
      this.cancelCreate();
      return;
    }

    const success = this.treeService.addNode(parentId, name, type);
    if (success) {
      this.treeChanged.emit();
    } else {
      alert('Failed to create. Name may already exist.');
    }

    this.cancelCreate();
  }

  cancelCreate() {
    this.creatingInParentId.set(null);
    this.creatingType.set(null);
    this.newItemName.set('');
  }

  startRename(node: FileNode, event?: Event) {
    if (event) event.stopPropagation();
    this.renamingNodeId.set(node.id);
    this.renameValue.set(node.name);
    this.selectedNodeId.set(node.id);
  }

  saveRename() {
    const nodeId = this.renamingNodeId();
    const newName = this.renameValue();

    if (nodeId && newName.trim()) {
      const success = this.treeService.renameNode(nodeId, newName);
      if (success) {
        this.treeChanged.emit();
      } else {
        alert('Rename failed. A file or folder with this name may already exist.');
      }
    }
    this.cancelRename();
  }

  cancelRename() {
    this.renamingNodeId.set(null);
    this.renameValue.set('');
  }

  // Select node on single click
  selectNode(node: FileNode, event: Event) {
    event.stopPropagation();
    this.selectedNodeId.set(node.id);
  }

  getFileIcon(node: FileNode) {
    return node.type === 'folder'
      ? this.iconService.getFolderIcon()
      : this.iconService.getFileIcon(node.extension);
  }

  getToggleIcon(node: FileNode): string {
    return this.iconService.getToggleIcon(!!node.expanded);
  }

  getFullPath(node: FileNode, parentPath = ''): string {
    return parentPath ? `${parentPath}/${node.name}` : node.name;
  }

  trackById(_: number, node: FileNode): string {
    return node.id;
  }
}
