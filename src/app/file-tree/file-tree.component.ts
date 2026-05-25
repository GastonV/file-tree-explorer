import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FileNode } from '../models/file-node.model';

@Component({
  selector: 'app-file-tree',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.scss']
})
export class FileTreeComponent {
  @Input() nodes: FileNode[] = [];
  @Output() nodesChange = new EventEmitter<FileNode[]>();

  drop(event: CdkDragDrop<FileNode[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    this.nodesChange.emit(this.nodes);
  }

  toggleExpand(node: FileNode) {
    if (node.type === 'folder') {
      node.expanded = !node.expanded;
    }
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

  getFullPath(node: FileNode, parentPath: string = ''): string {
    const current = parentPath ? `${parentPath}/${node.name}` : node.name;
    return current;
  }

  trackById(_: number, node: FileNode): string {
    return node.id;
  }
}
