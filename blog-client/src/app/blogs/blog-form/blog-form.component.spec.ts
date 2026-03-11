import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlogFormComponent } from './blog-form.component';
import { BlogService } from '../../services/blog.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../material/material.module';

describe('BlogFormComponent', () => {
  let component: BlogFormComponent;
  let fixture: ComponentFixture<BlogFormComponent>;
  let blogServiceSpy: any;
  let routerSpy: any;
  let snackBarSpy: any;

  beforeEach(async () => {
    // Spies using vi.fn()
    blogServiceSpy = {
      getById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    };

    routerSpy = {
      navigate: vi.fn(),
    };

    snackBarSpy = {
      open: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule, MaterialModule, BlogFormComponent],
      providers: [
        { provide: BlogService, useValue: blogServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: vi.fn(() => null), // null = create mode
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize in create mode when no id param', () => {
    expect(component.isEditMode).toBe(false);
    expect(component.isNewBlog).toBe(true);
  });

  it('should call create blog on submit in create mode', () => {
    component.blog = {
      name: 'Test Blog',
      description: 'Test Description',
      author: 'Tester',
    };

    blogServiceSpy.create.mockReturnValue(of(component.blog));

    component.onSubmit();

    expect(blogServiceSpy.create).toHaveBeenCalledWith(component.blog);
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Blog saved successfully!',
      'Close',
      expect.any(Object)
    );
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should navigate to home on cancel', () => {
    component.onCancel();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should set formChanged true on input change in edit mode', () => {
    component.isEditMode = true;
    component.formChanged = false;

    component.onInputChange();

    expect(component.formChanged).toBe(true);
  });
});