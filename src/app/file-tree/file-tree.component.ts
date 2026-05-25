import { Component, inject, input, output } from '@angular/core';
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
  // Signal-based inputs (Angular 21+ recommended)
  nodes = input<FileNode[]>([]);

  // Signal-based output
  treeChanged = output<void>();

  private treeService = inject(TreeService);
  private iconService = inject(IconService);

  // Decoupled drop handler - delegates move to TreeService
  drop(event: CdkDragDrop<FileNode[]>, targetParentId: string | null = null) {
    const draggedNode = event.item.data as FileNode;
    if (!draggedNode) return;

    const currentIndex = event.currentIndex;

    const success = this.treeService.moveNode(
      draggedNode.id,
      targetParentId,
      currentIndex
    );

    if (success) {
      this.treeChanged.emit();
    }
  }

  toggleExpand(node: FileNode) {
    this.treeService.toggleExpand(node.id);
    this.treeService.saveTree().subscribe();
  }

  // Professional icon resolution via dedicated service
  getFileIcon(node: FileNode): string {
    return node.type === 'folder'
      ? this.iconService.getFolderIcon()
      : this.iconService.getFileIcon(node.extension);
  }

  getToggleIcon(node: FileNode): string {
    return this.iconService.getToggleIcon(!!node.expanded);
  }

  // Context-aware full path (supports recursive arbitrary depth)
  getFullPath(node: FileNode, parentPath: string = ''): string {
    const current = parentPath ? `${parentPath}/${node.name}` : node.name;
    return current;
  }

  trackById(_: number, node: FileNode): string {
    return node.id;
  }
}
