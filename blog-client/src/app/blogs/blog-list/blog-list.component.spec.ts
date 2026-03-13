import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlogListComponent } from './blog-list.component';
import { BlogService } from '../../services/blog.service';
import { Router } from '@angular/router';
import { of, BehaviorSubject } from 'rxjs';
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

  const blogsSubject = new BehaviorSubject(mockBlogs);

  beforeEach(async () => {
    // Jasmine spies
    blogServiceSpy = jasmine.createSpyObj('BlogService', ['loadAll', 'delete','isEmpty'],{
      blogs$: blogsSubject.asObservable()
    });
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    blogServiceSpy.loadAll.and.returnValue(of(mockBlogs));
    blogServiceSpy.isEmpty.and.returnValue(true);

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

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load blogs on init if service is empty', () => {

    component.ngOnInit();

    expect(blogServiceSpy.isEmpty).toHaveBeenCalled();
    expect(blogServiceSpy.loadAll).toHaveBeenCalled();
  });

  it('should not call loadAll if blogs already exist', () => {

    blogServiceSpy.isEmpty.and.returnValue(false);

    component.ngOnInit();

    expect(blogServiceSpy.loadAll).not.toHaveBeenCalled();
  });

  // it('should handle error when loading blogs', () => {
  //   blogServiceSpy.getAll.and.returnValue(throwError(() => new Error('Fail')));

  //   component.loadBlogs();

  //   expect(blogServiceSpy.getAll).toHaveBeenCalled();
  //   expect(component.blogs).toEqual([]);
  //   expect(component.loading).toBe(false);
  //   expect(component.errorMessage).toBe('Failed to load blogs.');
  // });

  it('should navigate to edit page', () => {

    const id = 1;

    component.edit(id);

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/edit', id]);
  });

  it('should navigate to create page', () => {
    component.create();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/create']);
  });

  it('should delete blog when confirmed', () => {

    spyOn(window, 'confirm').and.returnValue(true);

    blogServiceSpy.delete.and.returnValue(of(void 0));

    component.delete(1);

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this blog?');
    expect(blogServiceSpy.delete).toHaveBeenCalledWith(1);
  });



  it('should not delete blog when confirmation cancelled', () => {

    spyOn(window, 'confirm').and.returnValue(false);

    component.delete(1);

    expect(blogServiceSpy.delete).not.toHaveBeenCalled();
  });

  it('should toggle select mode', () => {

    component.selectMode = false;

    component.toggleSelectMode();

    expect(component.selectMode).toBeTrue();

    component.toggleSelectMode();

    expect(component.selectMode).toBeFalse();
  });

  it('should select and deselect blogs', () => {

    component.toggleBlogSelection(1);

    expect(component.selectedBlogs.has(1)).toBeTrue();

    component.toggleBlogSelection(1);

    expect(component.selectedBlogs.has(1)).toBeFalse();
  });

  it('should delete selected blogs when confirmed', () => {

    spyOn(window, 'confirm').and.returnValue(true);

    blogServiceSpy.delete.and.returnValue(of(void 0));

    component.selectedBlogs.add(1);
    component.selectedBlogs.add(2);

    component.deleteSelected();

    expect(blogServiceSpy.delete).toHaveBeenCalledWith(1);
    expect(blogServiceSpy.delete).toHaveBeenCalledWith(2);
  });
});