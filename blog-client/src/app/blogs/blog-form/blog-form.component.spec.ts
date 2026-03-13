import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlogFormComponent } from './blog-form.component';
import { BlogService } from '../../services/blog.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material/material.module';
import { Blog } from '../../models/blog';

describe('BlogFormComponent', () => {
  let component: BlogFormComponent;
  let fixture: ComponentFixture<BlogFormComponent>;
  let blogServiceSpy: jasmine.SpyObj<BlogService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  const mockBlog: Blog = {
  id: 1,
  name: 'Test Blog',
  description: 'Test Description',
  author: 'Tester'
  };

  beforeEach(async () => {

    blogServiceSpy = jasmine.createSpyObj('BlogService', [
      'getById',
      'create',
      'update'
    ]);

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MaterialModule,
        BlogFormComponent
      ],
      providers: [
        { provide: BlogService, useValue: blogServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: jasmine.createSpy('get').and.returnValue(null) // Create mode
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BlogFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize in create mode when no id param', () => {
    expect(component.isEditMode).toBeFalse();
    expect(component.isNewBlog).toBeTrue();
  });

  it('should call create blog on submit in create mode', () => {

    component.blogForm.patchValue({
      name: 'Test Blog',
      description: 'Test Description',
      author: 'Tester'
    });

    component.initialFormValue = {
      name: '',
      description: '',
      author: ''
    };

    blogServiceSpy.create.and.returnValue(of(mockBlog));

    component.onSubmit();

    expect(blogServiceSpy.create).toHaveBeenCalledWith(
      component.blogForm.getRawValue()
    );

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Blog saved successfully!',
      'Close',
      jasmine.any(Object)
    );

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should navigate to home on cancel', () => {
    component.onCancel();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should detect form changes correctly', () => {

    component.initialFormValue = {
      name: 'Old',
      description: 'Old desc',
      author: 'Old author'
    };

    component.blogForm.patchValue({
      name: 'New',
      description: 'Old desc',
      author: 'Old author'
    });

    expect(component.hasFormChanged()).toBeTrue();
  });

  it('should not detect change when form values are same', () => {

    component.initialFormValue = {
      id: null,
      name: 'Same',
      description: 'Same desc',
      author: 'Same author'
    };

    component.blogForm.patchValue({
      name: 'Same',
      description: 'Same desc',
      author: 'Same author'
    });

    expect(component.hasFormChanged()).toBeFalse();
  });

  it('should call update blog on submit in edit mode', () => {

    component.isEditMode = true;
    component.blogId = 1;

    component.blogForm.patchValue({
      id: 1,
      name: 'Updated Blog',
      description: 'Updated Description',
      author: 'Tester'
    });

    component.initialFormValue = {
      id:1,
      name: 'Old Blog',
      description: 'Old Description',
      author: 'Tester'
    };

    blogServiceSpy.update.and.returnValue(of(void(0)));

    component.onSubmit();

    expect(blogServiceSpy.update).toHaveBeenCalledWith(
      1,
      component.blogForm.getRawValue()
    );

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Blog updated successfully!',
      'Close',
      jasmine.any(Object)
    );

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

});