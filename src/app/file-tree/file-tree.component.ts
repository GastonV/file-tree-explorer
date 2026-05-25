import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { FileNode } from '../models/file-node.model';
import { TreeService } from '../services/tree.service';

@Component({
  selector: 'app-file-tree',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.scss']
})
export class FileTreeComponent {
  @Input() nodes: FileNode[] = [];
  @Output() treeChanged = new EventEmitter<void>();

  private treeService = inject(TreeService);

  // Decoupled drop handler - delegates move to TreeService
  drop(event: CdkDragDrop<FileNode[]>, targetParentId: string | null = null) {
    const draggedNode = event.item.data as FileNode;
    if (!draggedNode) return;

    const previousIndex = event.previousIndex;
    const currentIndex = event.currentIndex;

    // Use service for the actual move/reorder logic (decoupled)
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
    // Persist expanded state so it survives refresh
    this.treeService.saveTree().subscribe();
  }

  getFileIcon(node: FileNode): string {
    if (node.type === 'folder') return '📁';
    return node.extension ? this.getExtensionIcon(node.extension) : '📄';
  }

  private getExtensionIcon(ext: string): string {
    const icons: { [key: string]: string } = {
      ts: '📘', js: '📙', html: '📗', css: '📕', md: '📖', json: '📋'
    };
    return icons[ext] || '📄';
  }

  // Improved path computation (context aware for recursion)
  getFullPath(node: FileNode, parentPath: string = ''): string {
    const current = parentPath ? `${parentPath}/${node.name}` : node.name;
    return current;
  }

  trackById(_: number, node: FileNode): string {
    return node.id;
  }
}
