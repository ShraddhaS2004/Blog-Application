import { describe, it, beforeEach, expect, vi } from 'vitest';
import { BlogService } from './blog.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Blog } from '../models/blog';

describe('BlogService', () => {
  let service: BlogService;
  let httpMock: any;

  const mockBlogs: Blog[] = [
    { id: 1, name: 'Blog1', description: 'Desc1', author: 'Author1' },
    { id: 2, name: 'Blog2', description: 'Desc2', author: 'Author2' },
  ];

  beforeEach(() => {
    httpMock = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };

    service = new BlogService(httpMock as unknown as HttpClient);
  });

  it('should load all blogs and update subject', (done) => {
    httpMock.get.mockReturnValue(of(mockBlogs));
    service.loadAll().subscribe(blogs => {
      expect(blogs).toEqual(mockBlogs);
      service.blogs$.subscribe(state => {
        expect(state).toEqual(mockBlogs);
      });
    });
  });

  it('should get a blog by id', (done) => {
    httpMock.get.mockReturnValue(of(mockBlogs[0]));
    service.getById(1).subscribe(blog => {
      expect(blog).toEqual(mockBlogs[0]);
      expect(httpMock.get).toHaveBeenCalledWith('http://localhost:5103/Blog/GetByIdDapper/1');
    });
  });

  it('should create a blog and prepend to blogsSubject', (done) => {
    const newBlog: Blog = { id: 3, name: 'Blog3', description: 'Desc3', author: 'Author3' };
    httpMock.post.mockReturnValue(of(newBlog));

    service.create(newBlog).subscribe(blog => {
      expect(blog).toEqual(newBlog);
      service.blogs$.subscribe(state => {
        expect(state[0]).toEqual(newBlog);
      });
    });
  });

  it('should update a blog in blogsSubject', (done) => {
    // set initial blogs
    (service as any).blogsSubject.next([...mockBlogs]);

    const updatedBlog: Blog = { id: 1, name: 'Updated', description: 'Updated Desc', author: 'Author1' };
    httpMock.put.mockReturnValue(of(void 0));

    service.update(1, updatedBlog).subscribe(() => {
      service.blogs$.subscribe(state => {
        expect(state.find(b => b.id === 1)).toEqual(updatedBlog);
      });
    });
  });

  it('should delete a blog from blogsSubject', (done) => {
    (service as any).blogsSubject.next([...mockBlogs]);
    httpMock.delete.mockReturnValue(of(void 0));

    service.delete(1).subscribe(() => {
      service.blogs$.subscribe(state => {
        expect(state.find(b => b.id === 1)).toBeUndefined();
        expect(state.length).toBe(1);
      });
    });
  });

  it('should search blogs and update subject', (done) => {
    const searchResult: Blog[] = [mockBlogs[1]];
    httpMock.get.mockReturnValue(of(searchResult));

    service.search('Blog2').subscribe(blogs => {
      expect(blogs).toEqual(searchResult);
      service.blogs$.subscribe(state => {
        expect(state).toEqual(searchResult);
      });
    });
  });

  it('should return true if blogsSubject is empty', () => {
    (service as any).blogsSubject.next([]);
    expect(service.isEmpty()).toBe(true);
  });

  it('should return false if blogsSubject has blogs', () => {
    (service as any).blogsSubject.next(mockBlogs);
    expect(service.isEmpty()).toBe(false);
  });
});