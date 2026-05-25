import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';

import { FileNode, TreeState } from '../models/file-node.model';

@Injectable({ providedIn: 'root' })
export class FileService {
  private http = inject(HttpClient);
  // Public API base - replace with real endpoint when available
  private apiUrl = '/api/files';

  // Example response from /api/files (flat file list format):
  // {
  //   name: 'Regular',
  //   filepaths: [
  //     '.editorconfig',
  //     '.gitignore',
  //     '.idea/vcs.xml',
  //     '.prettierrc',
  //     'README.md',
  //     'bin/run',
  //     'bin/run.cmd',
  //     'package.json',
  //     'src/commands/benchmark.ts',
  //     // ... (full list of paths, supports arbitrary depth)
  //   ]
  // }

  // For demo, use localStorage backed data with sample tree of arbitrary depth
  private getSampleData(): FileNode[] {
    return [
      {
        id: '1',
        name: 'src',
        type: 'folder',
        children: [
          {
            id: '1-1',
            name: 'app',
            type: 'folder',
            children: [
              { id: '1-1-1', name: 'app.ts', type: 'file', extension: 'ts', size: 1200 },
              { id: '1-1-2', name: 'app.html', type: 'file', extension: 'html', size: 800 }
            ],
            expanded: true
          },
          { id: '1-2', name: 'main.ts', type: 'file', extension: 'ts', size: 450 }
        ],
        expanded: true
      },
      {
        id: '2',
        name: 'README.md',
        type: 'file',
        extension: 'md',
        size: 1470
      }
    ];
  }

  loadTree(): Observable<FileNode[]> {
    // Check localStorage first for persisted state (prevents reset on refresh)
    const stored = localStorage.getItem('file-tree-state');
    if (stored) {
      try {
        const state: TreeState = JSON.parse(stored);
        if (state.nodes && state.nodes.length > 0) {
          return of(state.nodes);
        }
      } catch {}
    }

    // Public API integration with graceful fallback (as per requirements)
    return this.http.get<FileNode[]>(this.apiUrl).pipe(
      catchError(() => of(this.getSampleData()))
    );
  }

  saveTree(nodes: FileNode[]): Observable<TreeState> {
    const state: TreeState = { nodes, lastUpdated: new Date().toISOString() };
    localStorage.setItem('file-tree-state', JSON.stringify(state));
    // In real: this.http.post(this.apiUrl, state)
    return of(state);
  }
}
