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

  private stagedUpsertsSubject = new BehaviorSubject<Blog[]>([]);
  stagedUpserts$ = this.stagedUpsertsSubject.asObservable();

  private tempIdCounter = -1;

  private stagedUpserts: Blog[] = [];

  private pendingDeletes: number[] = [];
private pendingDeletesSubject = new BehaviorSubject<number[]>([]);
pendingDeletes$ = this.pendingDeletesSubject.asObservable();

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

  removeStagedIfExists(id: number): boolean {
  const index = this.stagedUpserts.findIndex(b => b.id === id);
  if (index > -1) {
    this.stagedUpserts.splice(index, 1);
    this.stagedUpsertsSubject.next([...this.stagedUpserts]);
    return true; // indicates it was staged and removed
  }
  return false; // not staged
}

  // Add this method to BlogService
search(term: string): Observable<Blog[]> {
  return this.http.get<Blog[]>(`${this.apiUrl}/SearchBlogsDapper/search?term=${encodeURIComponent(term)}`).pipe(
    tap(blogs => {
      this.blogsSubject.next(blogs);
    })
  );
}

deleteMultiple(ids: number[]) {
  return this.http.delete(`${this.apiUrl}/DeleteMultiple/DeleteMultiple`, {
    body: ids
  });
}

stageUpsert(blog: Blog) {
  if (!blog.id || blog.id === 0) {
    blog.id = this.tempIdCounter--;
  }

  const stagedIndex = this.stagedUpserts.findIndex(b => b.id === blog.id);
  if (stagedIndex > -1) {
    this.stagedUpserts[stagedIndex] = blog;
  } else {
    this.stagedUpserts.unshift(blog);
  }

  this.stagedUpsertsSubject.next([...this.stagedUpserts]);

  // 3️⃣ Update frontend blogsSubject safely
  // const currentBlogs = this.blogsSubject.value.slice();
  // const index = currentBlogs.findIndex(b => b.id === blog.id);
  // if (index > -1) {
  //   currentBlogs[index] = blog;
  // } else {
  //   currentBlogs.unshift(blog);
  // }

  // this.blogsSubject.next(currentBlogs);
  const currentBlogs = this.blogsSubject.value
    .filter(b => b.id !== blog.id); // remove old version first

  this.blogsSubject.next([blog, ...currentBlogs]);
  }

upsert(blogs: Blog[]): Observable<any> {
  const payload = this.stagedUpserts.map(b => ({
    ...b,
    id: b.id! < 0 ? 0 : b.id // backend interprets 0 as new blog
  }));
    // API endpoint for upsert should handle both create and update
    return this.http.post(`${this.apiUrl}/Upsert/Upsert`, payload).pipe(
    tap(res => {
      this.tempIdCounter = -1; // reset temp counter
    })
  );
  }

  clearStaged() {
  this.stagedUpserts = [];
  this.stagedUpsertsSubject.next([]);
}

  isEmpty(): boolean {
    return this.blogsSubject.value.length === 0;
  }

  addDelete(id: number) {
  if (id < 0) {
    this.removeStagedIfExists(id);
    return;
  }

  // ✅ If it's already staged (existing blog edited but not saved yet)
  const wasStaged = this.removeStagedIfExists(id);

  // ✅ Only add to deletes if it wasn't just removed from staging
  if (!wasStaged && !this.pendingDeletes.includes(id)) {
    this.pendingDeletes.push(id);
    this.pendingDeletesSubject.next([...this.pendingDeletes]);
  }
}

getDeletes(): number[] {
  return this.pendingDeletes;
}

clearDeletes() {
  this.pendingDeletes = [];
  this.pendingDeletesSubject.next([]);
}
}