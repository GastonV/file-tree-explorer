import { TestBed } from '@angular/core/testing';
import { IconService } from './icon.service';

describe('IconService', () => {
  let service: IconService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IconService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getFolderIcon', () => {
    it('should return folder icon with color', () => {
      const result = service.getFolderIcon();
      expect(result.icon).toBe('folder');
      expect(result.color).toBeDefined();
    });
  });

  describe('getFileIcon', () => {
    it('should return correct icon and color for known extensions', () => {
      const ts = service.getFileIcon('ts');
      expect(ts.icon).toBe('code');
      expect(ts.color).toBe('#3178c6');

      const js = service.getFileIcon('js');
      expect(js.icon).toBe('javascript');

      const html = service.getFileIcon('html');
      expect(html.icon).toBe('html');
    });

    it('should return default file icon for unknown extensions', () => {
      const unknown = service.getFileIcon('xyz');
      expect(unknown.icon).toBe('insert_drive_file');

      const noExt = service.getFileIcon();
      expect(noExt.icon).toBe('insert_drive_file');
    });

    it('should be case insensitive', () => {
      const tsUpper = service.getFileIcon('TS');
      expect(tsUpper.icon).toBe('code');
    });
  });

  describe('getToggleIcon', () => {
    it('should return expand_more when expanded', () => {
      expect(service.getToggleIcon(true)).toBe('expand_more');
    });

    it('should return chevron_right when collapsed', () => {
      expect(service.getToggleIcon(false)).toBe('chevron_right');
    });
  });
});
