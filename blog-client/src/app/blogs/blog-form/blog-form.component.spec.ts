import { describe, it, beforeEach, expect, vi } from 'vitest';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { BlogFormComponent } from './blog-form.component';
import { BlogService } from '../../services/blog.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';

describe('BlogFormComponent', () => {
  let component: BlogFormComponent;
  let blogServiceMock: any;
  let snackBarMock: any;
  let routerMock: any;
  let routeMock: any;

  beforeEach(() => {
    blogServiceMock = {
      getById: vi.fn().mockReturnValue(of({ id: 1, name: 'Test', description: 'Desc', author: 'Author' })),
      create: vi.fn().mockReturnValue(of({})),
      update: vi.fn().mockReturnValue(of({}))
    };

    snackBarMock = { open: vi.fn() };
    routerMock = { navigate: vi.fn() };
    routeMock = { snapshot: { paramMap: { get: vi.fn().mockReturnValue(null) } } };

    component = new BlogFormComponent(
      routeMock as any,
      blogServiceMock as any,
      routerMock as any,
      snackBarMock as any,
      new FormBuilder()
    );
  });

  it('should initialize form in new blog mode', () => {
    component.ngOnInit();
    expect(component.blogForm).toBeDefined();
    expect(component.isNewBlog).toBe(true);
    expect(component.isEditMode).toBe(false);
    expect(component.blogForm.value.name).toBe('');
  });

  it('should initialize form in edit mode', () => {
    routeMock.snapshot.paramMap.get = vi.fn().mockReturnValue('1');
    component.ngOnInit();
    expect(component.isEditMode).toBe(true);
    expect(blogServiceMock.getById).toHaveBeenCalledWith(1);
    setTimeout(() => {
      expect(component.blogForm.value.name).toBe('Test');
    }, 0);
  });

  it('should detect form changes', () => {
    component.ngOnInit();
    expect(component.hasFormChanged()).toBe(false);
    component.blogForm.patchValue({ name: 'New Name' });
    expect(component.hasFormChanged()).toBe(true);
  });

  it('should navigate on cancel', () => {
    component.onCancel();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should show snackbar and navigate if no changes on submit', () => {
    component.ngOnInit();
    component.onSubmit();
    expect(snackBarMock.open).toHaveBeenCalledWith('No changes detected!', 'Close', { duration: 2000 });
    setTimeout(() => {
      expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
    }, 500);
  });

  it('should call create on submit in new mode', () => {
    component.ngOnInit();
    component.blogForm.patchValue({ name: 'Blog', description: 'Desc', author: 'Author' });
    component.onSubmit();
    expect(blogServiceMock.create).toHaveBeenCalled();
    expect(snackBarMock.open).toHaveBeenCalledWith('Blog saved successfully!', 'Close', expect.any(Object));
  });

  it('should call update on submit in edit mode', () => {
    routeMock.snapshot.paramMap.get = vi.fn().mockReturnValue('1');
    component.ngOnInit();
    setTimeout(() => {
      component.blogForm.patchValue({ name: 'Updated' });
      component.onSubmit();
      expect(blogServiceMock.update).toHaveBeenCalledWith(1, expect.objectContaining({ name: 'Updated' }));
      expect(snackBarMock.open).toHaveBeenCalledWith('Blog updated successfully!', 'Close', expect.any(Object));
    }, 0);
  });
});