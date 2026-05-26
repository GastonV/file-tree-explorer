import { Component, inject, input, output, signal } from '@angular/core';
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

  drop(event: CdkDragDrop<FileNode[]>, targetParentId: string | null = null) {
    const draggedNode = event.item.data as FileNode;
    if (!draggedNode) return;

    const success = this.treeService.moveNode(draggedNode.id, targetParentId, event.currentIndex);
    if (success) this.treeChanged.emit();
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
      }
    }
  }

  // Start inline creation
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

  // Rename
  startRename(node: FileNode, event?: Event) {
    if (event) event.stopPropagation();
    this.renamingNodeId.set(node.id);
    this.renameValue.set(node.name);
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
