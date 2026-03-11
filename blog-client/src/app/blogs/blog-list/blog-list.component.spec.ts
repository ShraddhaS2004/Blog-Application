import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlogListComponent } from './blog-list.component';
import { BlogService } from '../../services/blog.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MaterialModule } from '../../material/material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

describe('BlogListComponent', () => {
  let component: BlogListComponent;
  let fixture: ComponentFixture<BlogListComponent>;
  let blogServiceSpy: any;
  let routerSpy: any;

  const mockBlogs = [
    { id: 1, name: 'Blog 1', description: 'Desc 1', author: 'Author 1' },
    { id: 2, name: 'Blog 2', description: 'Desc 2', author: 'Author 2' }
  ];

  beforeEach(async () => {
    blogServiceSpy = {
      getAll: vi.fn(),
      delete: vi.fn()
    };

    routerSpy = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterModule, MaterialModule, BlogListComponent],
      providers: [
        { provide: BlogService, useValue: blogServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BlogListComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should load blogs on init', () => {
    blogServiceSpy.getAll.mockReturnValue(of(mockBlogs));
    component.ngOnInit();
    expect(blogServiceSpy.getAll).toHaveBeenCalled();
    expect(component.blogs).toEqual(mockBlogs);
    expect(component.loading).toBe(false);
  });

  it('should handle error when loading blogs', () => {
    blogServiceSpy.getAll.mockReturnValue(throwError(() => new Error('Fail')));
    component.loadBlogs();
    expect(blogServiceSpy.getAll).toHaveBeenCalled();
    expect(component.blogs).toEqual([]);
    expect(component.loading).toBe(false);
    expect(component.errorMessage).toBe('Failed to load blogs.');
  });

  it('should navigate to edit page', () => {
    const id = 1;
    component.edit(id);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/edit', id]);
  });

  it('should navigate to create page', () => {
    component.create();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/create']);
  });

  it('should call delete blog and reload blogs on confirm', () => {
    (globalThis as any).confirm = vi.fn(() => true); // mock confirm dialog to return true
    blogServiceSpy.delete.mockReturnValue(of({}));
    blogServiceSpy.getAll.mockReturnValue(of(mockBlogs));

    component.delete(1);

    expect((globalThis as any).confirm).toHaveBeenCalledWith('Are you sure you want to delete this blog?');
    expect(blogServiceSpy.delete).toHaveBeenCalledWith(1);
    expect(blogServiceSpy.getAll).toHaveBeenCalled(); // reload after delete
  });

  it('should not delete blog if user cancels', () => {
     (globalThis as any).confirm = vi.fn(() => false); // user cancels
    component.delete(1);
    expect(blogServiceSpy.delete).not.toHaveBeenCalled();
    expect(blogServiceSpy.getAll).not.toHaveBeenCalled();
  });
});