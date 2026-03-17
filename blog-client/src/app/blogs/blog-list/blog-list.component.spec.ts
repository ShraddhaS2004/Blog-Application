import { describe, it, beforeEach, expect, vi } from 'vitest';
import { of, BehaviorSubject } from 'rxjs';
import { BlogListComponent } from './blog-list.component';
import { BlogService } from '../../services/blog.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('BlogListComponent', () => {
  let component: BlogListComponent;
  let blogServiceMock: any;
  let routerMock: any;
  let snackBarMock: any;

  beforeEach(() => {
    const blogsSubject = new BehaviorSubject([
      { id: 1, name: 'Blog 1', description: 'Desc 1', author: 'Author 1' },
      { id: 2, name: 'Blog 2', description: 'Desc 2', author: 'Author 2' }
    ]);

    blogServiceMock = {
      blogs$: blogsSubject.asObservable(),
      blogsSubject,
      isEmpty: vi.fn().mockReturnValue(true),
      loadAll: vi.fn().mockReturnValue(of([])),
      search: vi.fn().mockReturnValue(of([])),
      delete: vi.fn().mockReturnValue(of({}))
    };

    routerMock = { navigate: vi.fn() };
    snackBarMock = { open: vi.fn() };

    component = new BlogListComponent(blogServiceMock, routerMock, snackBarMock);
  });

  it('should initialize blogs and paginatedBlogs', () => {
    component.ngOnInit();
    component.blogs$.subscribe(blogs => {
      expect(blogs.length).toBe(2);
    });
    component.paginatedBlogs$.subscribe(paginated => {
      expect(paginated.length).toBeLessThanOrEqual(component.pageSize);
    });
    expect(component.loading).toBe(false);
  });

  it('should navigate to edit', () => {
    component.edit(1);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/edit', 1]);
  });

  it('should navigate to create', () => {
    component.create();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/create']);
  });

  it('should toggle select mode and clear selections', () => {
    component.selectedBlogs.add(1);
    component.toggleSelectMode(); // enable
    expect(component.selectMode).toBe(true);
    component.toggleSelectMode(); // disable
    expect(component.selectMode).toBe(false);
    expect(component.selectedBlogs.size).toBe(0);
  });

  it('should toggle blog selection', () => {
    component.toggleBlogSelection(1);
    expect(component.isSelected(1)).toBe(true);
    component.toggleBlogSelection(1);
    expect(component.isSelected(1)).toBe(false);
  });

  it('should call deleteSelected with confirmation', () => {
    vi.stubGlobal('confirm', () => true);
    component.selectedBlogs.add(1);
    component.deleteSelected();
    expect(blogServiceMock.delete).toHaveBeenCalledWith(1);
    expect(component.selectedBlogs.size).toBe(0);
    expect(component.selectMode).toBe(false);
  });

  it('should call delete single blog with confirmation', () => {
    vi.stubGlobal('confirm', () => true);
    component.delete(1);
    expect(blogServiceMock.delete).toHaveBeenCalledWith(1);
  });

  it('should handle search input empty', () => {
    component.searchTerm = '';
    component.onSearchInputChange();
    expect(blogServiceMock.loadAll).toHaveBeenCalled();
  });

  it('should handle clearSearch', () => {
    component.clearSearch();
    expect(blogServiceMock.loadAll).toHaveBeenCalled();
    expect(component.searchTerm).toBe('');
  });

  it('should change page index', () => {
    component.onPageChange({ pageIndex: 2 });
    // Access private property via @ts-ignore
    // @ts-ignore
    expect(component.pageIndex$.value).toBe(2);
  });
});