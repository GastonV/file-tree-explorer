import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-info-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>File Tree Explorer</h2>
    
    <mat-dialog-content>
      <p>A modern, IDE-style file explorer built with Angular 21.</p>
      
      <h4>Features</h4>
      <ul>
        <li>Create, rename, and delete files & folders</li>
        <li>Inline editing (no modals)</li>
        <li>Drag & drop reorganization</li>
        <li>Color-coded file type icons</li>
        <li>State persistence (localStorage)</li>
        <li>Keyboard-friendly interactions</li>
      </ul>
    </mat-dialog-content>
    
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  styles: [`
    h4 { margin-top: 16px; margin-bottom: 8px; }
    ul { padding-left: 20px; }
    li { margin-bottom: 4px; }
  `]
})
export class InfoDialogComponent {
  constructor(public dialogRef: MatDialogRef<InfoDialogComponent>) {}
}
