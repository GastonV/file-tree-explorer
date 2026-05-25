import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, map } from 'rxjs';

import { FileNode, TreeState, ApiFilesResponse } from '../models/file-node.model';

@Injectable({ providedIn: 'root' })
export class FileService {
  private http = inject(HttpClient);
  private apiUrl = '/api/files';

  /**
   * Converts a flat list of file paths into a nested FileNode tree.
   * Supports arbitrary depth and mixed files/folders at any level.
   */
  buildTreeFromPaths(filepaths: string[]): FileNode[] {
    const root: FileNode[] = [];

    filepaths.forEach((path, index) => {
      const parts = path.split('/').filter(Boolean);
      let currentChildren = root;

      parts.forEach((part, partIndex) => {
        const isLast = partIndex === parts.length - 1;
        const extension = isLast ? part.split('.').pop() : undefined;

        let existing = currentChildren.find(n => n.name === part);

        if (!existing) {
          existing = {
            id: `node-${index}-${partIndex}-${Date.now()}`,
            name: part,
            type: isLast ? 'file' : 'folder',
            extension: isLast ? extension : undefined,
            children: isLast ? undefined : [],
            expanded: !isLast
          };
          currentChildren.push(existing);
        }

        if (!isLast && existing.children) {
          currentChildren = existing.children;
        }
      });
    });

    return root;
  }

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
    const stored = localStorage.getItem('file-tree-state');
    if (stored) {
      try {
        const state: TreeState = JSON.parse(stored);
        if (state.nodes && state.nodes.length > 0) {
          return of(state.nodes);
        }
      } catch {}
    }

    return this.http.get<FileNode[] | ApiFilesResponse>(this.apiUrl).pipe(
      map((response) => {
        if (Array.isArray(response)) {
          return response;
        }
        if (response && Array.isArray(response.filepaths)) {
          return this.buildTreeFromPaths(response.filepaths);
        }
        return this.getSampleData();
      }),
      catchError(() => of(this.getSampleData()))
    );
  }

  saveTree(nodes: FileNode[]): Observable<TreeState> {
    const state: TreeState = { nodes, lastUpdated: new Date().toISOString() };
    localStorage.setItem('file-tree-state', JSON.stringify(state));
    return of(state);
  }
}
