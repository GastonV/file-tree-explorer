import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TreeService } from './services/tree.service';
import { FileTreeComponent } from './file-tree/file-tree.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FileTreeComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = 'file-tree-explorer';
  private treeService = inject(TreeService);

  nodes = this.treeService.nodes;
  loading = this.treeService.loading;

  constructor() {
    this.treeService.loadTree().subscribe();
  }

  onTreeChanged() {
    this.treeService.saveTree().subscribe();
  }
}
