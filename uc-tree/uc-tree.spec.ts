import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcTree } from './uc-tree';
import type { UcTreeNode } from './uc-tree-node';

describe('UcTree', () => {
  let component: UcTree<string>;
  let fixture: ComponentFixture<UcTree<string>>;

  const nodes = (): UcTreeNode<string>[] => [
    {
      id: 'components',
      label: 'Components',
      children: [
        { id: 'components/button', label: 'Button' },
        { id: 'components/select', label: 'Select' },
      ],
    },
    {
      id: 'utilities',
      label: 'Utilities',
      children: [{ id: 'utilities/flex', label: 'Flex' }],
    },
    { id: 'about', label: 'About' },
  ];

  const rows = (): HTMLElement[] => {
    const host = fixture.nativeElement as HTMLElement;

    return Array.from(host.querySelectorAll<HTMLElement>('.uc-tree-node'));
  };

  const labels = (): string[] => rows().map((row) => row.textContent?.trim() ?? '');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UcTree],
    }).compileComponents();

    fixture = TestBed.createComponent<UcTree<string>>(UcTree);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('nodes', nodes());
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render only the roots while everything is collapsed', () => {
    expect(labels()).toEqual(['Components', 'Utilities', 'About']);
  });

  it('should give the tree and its rows their ARIA wiring', () => {
    const host = fixture.nativeElement as HTMLElement;
    const tree = host.querySelector('cdk-tree')!;
    const [branch, , leaf] = rows();

    fixture.componentRef.setInput('ariaLabel', 'Showcases');
    fixture.detectChanges();

    expect(tree.getAttribute('role')).toBe('tree');
    expect(tree.getAttribute('aria-label')).toBe('Showcases');
    expect(branch.getAttribute('role')).toBe('treeitem');
    expect(branch.getAttribute('aria-expanded')).toBe('false');
    expect(branch.getAttribute('aria-level')).toBe('1');
    expect(branch.getAttribute('aria-setsize')).toBe('3');
    expect(branch.getAttribute('aria-posinset')).toBe('1');
    // A leaf is not expandable, so it carries no expansion state at all.
    expect(leaf.getAttribute('aria-expanded')).toBeNull();
  });

  it('should honour the expansion it was handed before its first render', () => {
    const fresh = TestBed.createComponent<UcTree<string>>(UcTree);

    fresh.componentRef.setInput('nodes', nodes());
    fresh.componentRef.setInput('expandedIds', ['components']);
    fresh.detectChanges();

    const host = fresh.nativeElement as HTMLElement;
    const rendered = Array.from(host.querySelectorAll<HTMLElement>('.uc-tree-node'));

    expect(rendered.map((row) => row.textContent?.trim())).toEqual([
      'Components',
      'Button',
      'Select',
      'Utilities',
      'About',
    ]);
  });

  it('should reveal children when a branch is expanded', () => {
    component.expand('components');
    fixture.detectChanges();

    expect(labels()).toEqual(['Components', 'Button', 'Select', 'Utilities', 'About']);
    expect(rows()[1].getAttribute('aria-level')).toBe('2');
  });

  it('should toggle a branch on click and leave the selection alone', () => {
    rows()[0].click();
    fixture.detectChanges();

    expect(component.expandedIds()).toEqual(['components']);
    expect(component.selectedId()).toBeNull();

    rows()[0].click();
    fixture.detectChanges();

    expect(component.expandedIds()).toEqual([]);
    expect(labels()).toEqual(['Components', 'Utilities', 'About']);
  });

  it('should select a branch on click when selectBranches is on', () => {
    fixture.componentRef.setInput('selectBranches', true);
    fixture.detectChanges();

    rows()[0].click();
    fixture.detectChanges();

    expect(component.selectedId()).toBe('components');
  });

  it('should select a leaf and emit it', () => {
    const activated: UcTreeNode<string>[] = [];
    component.nodeActivated.subscribe((node) => activated.push(node));

    component.expand('components');
    fixture.detectChanges();
    rows()[1].click();
    fixture.detectChanges();

    expect(component.selectedId()).toBe('components/button');
    expect(activated.map((node) => node.id)).toEqual(['components/button']);
    expect(rows()[1].classList).toContain('uc-tree-node--selected');
  });

  it('should ignore a disabled node', () => {
    fixture.componentRef.setInput('nodes', [{ id: 'off', label: 'Off', disabled: true }]);
    fixture.detectChanges();

    rows()[0].click();
    fixture.detectChanges();

    expect(component.selectedId()).toBeNull();
  });

  it('should toggle from the twisty without activating the row', () => {
    const activated: UcTreeNode<string>[] = [];
    component.nodeActivated.subscribe((node) => activated.push(node));

    fixture.componentRef.setInput('expandOnActivate', false);
    fixture.detectChanges();

    rows()[0].querySelector<HTMLElement>('.uc-tree-node__twisty')!.click();
    fixture.detectChanges();

    expect(component.expandedIds()).toEqual(['components']);
    expect(activated).toEqual([]);
  });

  it('should keep a row click from expanding when expandOnActivate is off', () => {
    fixture.componentRef.setInput('expandOnActivate', false);
    fixture.detectChanges();

    rows()[0].click();
    fixture.detectChanges();

    expect(component.expandedIds()).toEqual([]);
  });

  it('should filter by label and open the branches leading to a match', () => {
    fixture.componentRef.setInput('filter', 'sel');
    fixture.detectChanges();

    expect(labels()).toEqual(['Components', 'Select']);
    // Auto-expansion is the filter's, not the reader's: clearing the filter
    // puts the tree back the way they left it.
    expect(component.expandedIds()).toEqual([]);
  });

  it('should keep the whole subtree of a branch that matches on its own label', () => {
    fixture.componentRef.setInput('filter', 'utilities');
    fixture.detectChanges();

    expect(labels()).toEqual(['Utilities', 'Flex']);
  });

  it('should let a reader close a branch the filter opened', () => {
    fixture.componentRef.setInput('filter', 'sel');
    fixture.detectChanges();

    rows()[0].click();
    fixture.detectChanges();

    expect(labels()).toEqual(['Components']);
  });

  it('should show the empty text when nothing matches', () => {
    fixture.componentRef.setInput('filter', 'nothing here');
    fixture.componentRef.setInput('emptyText', 'No match.');
    fixture.detectChanges();

    expect(rows()).toHaveLength(0);
    const host = fixture.nativeElement as HTMLElement;

    expect(host.querySelector('.uc-tree__empty')?.textContent?.trim()).toBe('No match.');
  });

  it('should expand and collapse every branch at once', () => {
    component.expandAll();
    fixture.detectChanges();

    expect(labels()).toEqual(['Components', 'Button', 'Select', 'Utilities', 'Flex', 'About']);

    component.collapseAll();
    fixture.detectChanges();

    expect(labels()).toEqual(['Components', 'Utilities', 'About']);
  });

  it('should indent each row by its depth', () => {
    component.expand('components');
    fixture.detectChanges();

    expect(rows()[0].style.getPropertyValue('--uc-tree-level-resolved')).toBe('0');
    expect(rows()[1].style.getPropertyValue('--uc-tree-level-resolved')).toBe('1');
  });
});
