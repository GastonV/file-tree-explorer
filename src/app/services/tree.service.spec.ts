import { TestBed } from '@angular/core/testing';
import { TreeService } from './tree.service';
import { FileNode } from '../models/file-node.model';

describe('TreeService', () => {
  let service: TreeService;

  const initialTree: FileNode[] = [
    {
      id: 'folder-1',
      name: 'src',
      type: 'folder',
      children: [
        { id: 'file-1', name: 'app.ts', type: 'file', extension: 'ts' },
        { id: 'file-2', name: 'main.ts', type: 'file', extension: 'ts' }
      ],
      expanded: true
    },
    {
      id: 'folder-2',
      name: 'docs',
      type: 'folder',
      children: [],
      expanded: true
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TreeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('moveNode', () => {
    it('should return false when source node does not exist', () => {
      const result = service.moveNode('non-existent-id', null, 0);
      expect(result).toBe(false);
    });

    it('should successfully move a file into another folder', () => {
      // Seed the service with data
      (service as any)._nodes.set(JSON.parse(JSON.stringify(initialTree)));

      const success = service.moveNode('file-1', 'folder-2', 0);

      expect(success).toBe(true);
    });
  });

  it('should expose nodes and loading as signals', () => {
    expect(typeof service.nodes).toBe('function');
    expect(typeof service.loading).toBe('function');
  });
});
