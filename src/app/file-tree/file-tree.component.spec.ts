import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileTreeComponent } from './file-tree.component';
import { FileNode } from '../models/file-node.model';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('FileTreeComponent', () => {
  let component: FileTreeComponent;
  let fixture: ComponentFixture<FileTreeComponent>;

  const mockNodes: FileNode[] = [
    {
      id: '1',
      name: 'src',
      type: 'folder',
      children: [
        { id: '1-1', name: 'app.ts', type: 'file', extension: 'ts', size: 1200 },
        { id: '1-2', name: 'style.css', type: 'file', extension: 'css' }
      ],
      expanded: true
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileTreeComponent],
      providers: [provideAnimations()]
    }).compileComponents();

    fixture = TestBed.createComponent(FileTreeComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('nodes', mockNodes);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render folder and file names', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('src');
    expect(compiled.textContent).toContain('app.ts');
    expect(compiled.textContent).toContain('style.css');
  });

  it('should return correct icon object for folders and files via getFileIcon()', () => {
    const folderIcon = component.getFileIcon(mockNodes[0]);
    const fileIcon = component.getFileIcon(mockNodes[0].children![0]);

    expect(folderIcon.icon).toBe('folder');
    expect(fileIcon.icon).toBe('code');
    expect(folderIcon.color).toBeDefined();
    expect(fileIcon.color).toBeDefined();
  });

  it('should return correct toggle icon based on expanded state', () => {
    const expandedIcon = component.getToggleIcon(mockNodes[0]);
    expect(expandedIcon).toBe('expand_more');

    mockNodes[0].expanded = false;
    const collapsedIcon = component.getToggleIcon(mockNodes[0]);
    expect(collapsedIcon).toBe('chevron_right');
  });

  it('should emit treeChanged when called', () => {
    const emitSpy = vi.fn();
    component.treeChanged.subscribe(emitSpy);

    component.treeChanged.emit();
    expect(emitSpy).toHaveBeenCalled();
  });
});
