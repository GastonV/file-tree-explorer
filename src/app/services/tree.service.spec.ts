import { TestBed } from '@angular/core/testing';
import { TreeService } from './tree.service';

describe('TreeService', () => {
  let service: TreeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TreeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should expose nodes and loading as signals', () => {
    expect(typeof service.nodes).toBe('function');
    expect(typeof service.loading).toBe('function');
  });

  describe('addNode', () => {
    it('should add a folder at root level', () => {
      const success = service.addNode(null, 'src', 'folder');
      expect(success).toBe(true);

      const nodes = service.nodes();
      const src = nodes.find(n => n.name === 'src');
      expect(src).toBeTruthy();
      expect(src!.type).toBe('folder');
    });

    it('should add a file inside a folder', () => {
      service.addNode(null, 'src', 'folder');
      const rootNodes = service.nodes();
      const srcFolder = rootNodes.find(n => n.name === 'src');

      const success = service.addNode(srcFolder!.id, 'app.ts', 'file');
      expect(success).toBe(true);

      expect(srcFolder!.children?.length).toBe(1);
      expect(srcFolder!.children?.[0].name).toBe('app.ts');
    });
  });

  describe('deleteNode', () => {
    it('should delete a node', () => {
      service.addNode(null, 'temp', 'folder');
      const nodes = service.nodes();
      const tempFolder = nodes.find(n => n.name === 'temp');

      const success = service.deleteNode(tempFolder!.id);
      expect(success).toBe(true);

      const updatedNodes = service.nodes();
      expect(updatedNodes.find(n => n.name === 'temp')).toBeUndefined();
    });
  });

  describe('renameNode', () => {
    it('should rename a node', () => {
      service.addNode(null, 'oldname', 'folder');
      const nodes = service.nodes();
      const folder = nodes.find(n => n.name === 'oldname');

      const success = service.renameNode(folder!.id, 'newname');
      expect(success).toBe(true);

      const updatedNodes = service.nodes();
      expect(updatedNodes.find(n => n.name === 'newname')).toBeTruthy();
    });
  });
});
