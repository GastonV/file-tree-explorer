import { TestBed } from '@angular/core/testing';
import { FileService } from './file.service';

describe('FileService', () => {
  let service: FileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('buildTreeFromPaths', () => {
    it('should convert flat paths to nested tree', () => {
      const paths = [
        'src/app.ts',
        'src/main.ts',
        'README.md',
        'src/app/app.component.ts'
      ];

      const tree = service.buildTreeFromPaths(paths);

      expect(tree.length).toBe(2);
      expect(tree[0].name).toBe('src');
      expect(tree[0].type).toBe('folder');
      expect(tree[0].children?.length).toBeGreaterThanOrEqual(2);
    });

    it('should handle deep nesting', () => {
      const paths = ['a/b/c/d.ts'];
      const tree = service.buildTreeFromPaths(paths);

      expect(tree[0].name).toBe('a');
      expect(tree[0].children?.[0].name).toBe('b');
      expect(tree[0].children?.[0].children?.[0].name).toBe('c');
    });

    it('should correctly set file extensions', () => {
      const paths = ['package.json', 'src/app.ts'];
      const tree = service.buildTreeFromPaths(paths);

      const jsonNode = tree.find(n => n.name === 'package.json');
      expect(jsonNode?.extension).toBe('json');

      const srcFolder = tree.find(n => n.name === 'src');
      const tsFile = srcFolder?.children?.find(n => n.name === 'app.ts');
      expect(tsFile?.extension).toBe('ts');
    });
  });
});
