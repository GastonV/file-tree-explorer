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

  it('should select a node when clicked', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const folderElement = compiled.querySelector('.tree-node') as HTMLElement;

    folderElement.click();
    fixture.detectChanges();

    expect(component.selectedNodeId()).toBe('1');
  });

  it('should trigger rename on F2 when a node is selected', () => {
    component.selectedNodeId.set('1');

    const event = new KeyboardEvent('keydown', { key: 'F2' });
    document.dispatchEvent(event);

    expect(component.renamingNodeId()).toBe('1');
  });

  it('should move selection down with ArrowDown', () => {
    component.selectedNodeId.set('1');

    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    document.dispatchEvent(event);

    expect(component.selectedNodeId()).not.toBe('1');
  });

  it('should move selection up with ArrowUp', () => {
    component.selectedNodeId.set('1-1');

    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    document.dispatchEvent(event);

    expect(component.selectedNodeId()).toBe('1');
  });
});
