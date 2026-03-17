// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { Blog } from '../models/blog';

// @Injectable({
//   providedIn: 'root'
// })
// export class BlogService {

//   private apiUrl = 'http://localhost:5103/Blog'; 

//   constructor(private http: HttpClient) {}

//   getAll(): Observable<Blog[]> {
//     return this.http.get<Blog[]>(`${this.apiUrl}/GetAll`);
//   }

//   getById(id: number): Observable<Blog> {
//     return this.http.get<Blog>(`${this.apiUrl}/GetById/${id}`);
//   }

//   create(blog: Blog): Observable<Blog> {
//     return this.http.post<Blog>(`${this.apiUrl}/Create`, blog);
//   }

//   update(id: number, blog: Blog): Observable<void> {
//     return this.http.put<void>(`${this.apiUrl}/Update/${id}`, blog);
//   }

//   delete(id: number): Observable<void> {
//     return this.http.delete<void>(`${this.apiUrl}/Delete/${id}`);
//   }
// }

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Blog } from '../models/blog';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  private apiUrl = 'http://localhost:5103/Blog';

  // Local state of blogs
  private blogsSubject = new BehaviorSubject<Blog[]>([]);
  blogs$ = this.blogsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Load all blogs once
  loadAll(): Observable<Blog[]> {
    return this.http.get<Blog[]>(`${this.apiUrl}/GetAllDapper`).pipe(
      tap(blogs => this.blogsSubject.next(blogs))
    );
  }

  getById(id: number): Observable<Blog> {
    return this.http.get<Blog>(`${this.apiUrl}/GetByIdDapper/${id}`);
  }

  create(blog: Blog): Observable<Blog> {
    return this.http.post<Blog>(`${this.apiUrl}/Create`, blog).pipe(
      tap(createdBlog => {
        this.blogsSubject.next([createdBlog,...this.blogsSubject.value]);
      })
    );
  }

  update(id: number, blog: Blog): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/Update/${id}`, blog).pipe(
      tap(() => {
        const updatedBlogs = this.blogsSubject.value.map(b =>
          b.id === id ? blog : b
        );
        this.blogsSubject.next(updatedBlogs);
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Delete/${id}`).pipe(
      tap(() => {
        const updatedBlogs = this.blogsSubject.value.filter(b => b.id !== id);
        this.blogsSubject.next(updatedBlogs);
      })
    );
  }

  // Add this method to BlogService
search(term: string): Observable<Blog[]> {
  return this.http.get<Blog[]>(`${this.apiUrl}/SearchBlogsDapper/search?term=${encodeURIComponent(term)}`).pipe(
    tap(blogs => {
      this.blogsSubject.next(blogs);
    })
  );
}

  isEmpty(): boolean {
    return this.blogsSubject.value.length === 0;
  }
}