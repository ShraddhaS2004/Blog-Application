import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BlogService } from './blog.service';
import { Blog } from '../models/blog';

describe('BlogService', () => {
  let service: BlogService;
  let httpMock: HttpTestingController;

  const mockBlogs: Blog[] = [
    { id: 1, name: 'Blog 1', description: 'Desc 1', author: 'Author 1' },
    { id: 2, name: 'Blog 2', description: 'Desc 2', author: 'Author 2' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BlogService],
    });

    service = TestBed.inject(BlogService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all blogs', () => {
    service.getAll().subscribe((blogs) => {
      expect(blogs).toEqual(mockBlogs);
      expect(blogs.length).toBe(2);
    });

    const req = httpMock.expectOne('http://localhost:5103/Blog/GetAll');
    expect(req.request.method).toBe('GET');
    req.flush(mockBlogs);
  });

  it('should fetch a blog by id', () => {
    const blog = mockBlogs[0];

    service.getById(blog.id!).subscribe((res) => {
      expect(res).toEqual(blog);
    });

    const req = httpMock.expectOne(`http://localhost:5103/Blog/GetById/${blog.id}`);
    expect(req.request.method).toBe('GET');
    req.flush(blog);
  });

  it('should create a new blog', () => {
    const newBlog: Blog = { name: 'New Blog', description: 'New Desc', author: 'Tester' };

    service.create(newBlog).subscribe((res) => {
      expect(res).toEqual({ id: 3, ...newBlog });
    });

    const req = httpMock.expectOne('http://localhost:5103/Blog/Create');
    expect(req.request.method).toBe('POST');
    req.flush({ id: 3, ...newBlog });
  });

  it('should update a blog', () => {
    const updatedBlog: Blog = { id: 1, name: 'Updated', description: 'Updated Desc', author: 'Author 1' };

    service.update(updatedBlog.id!, updatedBlog).subscribe((res) => {
      expect(res).toBeNull(); // update returns void
    });

    const req = httpMock.expectOne(`http://localhost:5103/Blog/Update/${updatedBlog.id}`);
    expect(req.request.method).toBe('PUT');
    req.flush(null);
  });

  it('should delete a blog', () => {
    const id = 1;

    service.delete(id).subscribe((res) => {
      expect(res).toBeNull(); // delete returns void
    });

    const req = httpMock.expectOne(`http://localhost:5103/Blog/Delete/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});