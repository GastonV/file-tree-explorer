import { Component, inject, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { TreeService } from './services/tree.service';
import { FileTreeComponent } from './file-tree/file-tree.component';
import { InfoDialogComponent } from './info-dialog/info-dialog.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FileTreeComponent, MatDialogModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = 'File Tree Explorer';
  private treeService = inject(TreeService);
  private dialog = inject(MatDialog);

  @ViewChild(FileTreeComponent) fileTree!: FileTreeComponent;

  nodes = this.treeService.nodes;
  loading = this.treeService.loading;

  constructor() {
    this.treeService.loadTree().subscribe();
  }

  onTreeChanged() {
    this.treeService.saveTree().subscribe();
  }

  addRootNode(type: 'file' | 'folder') {
    if (this.fileTree) {
      this.fileTree.startCreating(null, type);
    }
  }

  showInfo() {
    this.dialog.open(InfoDialogComponent, {
      width: '400px',
      maxWidth: '90vw'
    });
  }
}
