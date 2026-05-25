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
    it('should return folder icon', () => {
      expect(service.getFolderIcon()).toBe('folder');
    });
  });

  describe('getFileIcon', () => {
    it('should return correct icon for known extensions', () => {
      expect(service.getFileIcon('ts')).toBe('code');
      expect(service.getFileIcon('js')).toBe('javascript');
      expect(service.getFileIcon('html')).toBe('html');
      expect(service.getFileIcon('md')).toBe('description');
      expect(service.getFileIcon('json')).toBe('data_object');
    });

    it('should return default file icon for unknown extensions', () => {
      expect(service.getFileIcon('xyz')).toBe('insert_drive_file');
      expect(service.getFileIcon()).toBe('insert_drive_file');
    });

    it('should be case insensitive', () => {
      expect(service.getFileIcon('TS')).toBe('code');
      expect(service.getFileIcon('HTML')).toBe('html');
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
