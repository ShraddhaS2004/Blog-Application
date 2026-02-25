import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Blog } from '../models/blog';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  private apiUrl = 'http://localhost:5103/api/Blog'; // adjust port if needed

  constructor(private http: HttpClient) {}

  getAll(): Observable<Blog[]> {
    return this.http.get<Blog[]>(this.apiUrl);
  }

  getById(id: number): Observable<Blog> {
    return this.http.get<Blog>(`${this.apiUrl}/${id}`);
  }

  create(blog: Blog): Observable<Blog> {
    return this.http.post<Blog>(this.apiUrl, blog);
  }

  update(id: number, blog: Blog): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, blog);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}