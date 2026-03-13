import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BlogService } from '../../services/blog.service';
import { Blog } from '../../models/blog';
import { MaterialModule } from '../../material/material.module';
import { Observable, BehaviorSubject, combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, FormsModule],
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent implements OnInit {

  blogs$ !: Observable<Blog[]>;
  paginatedBlogs$!: Observable<Blog[]>;

  pageSize = 6;
  private pageIndex$ = new BehaviorSubject<number>(0);

  loading = false;
  errorMessage = '';

  selectMode = false;             // tracks if selection mode is on
  selectedBlogs = new Set<number>(); // tracks selected blog IDs

  constructor(
    private blogService: BlogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.blogs$ = this.blogService.blogs$;

    this.paginatedBlogs$ = combineLatest([
      this.blogs$,
      this.pageIndex$
    ]).pipe(
      map(([blogs, pageIndex]) => {
        const start = pageIndex * this.pageSize;
        const end = start + this.pageSize;
        return blogs.slice(start, end);
      })
    );

    if (this.blogService.isEmpty()) {
    this.loading = true;
    this.blogService.loadAll().subscribe({
      next: () => this.loading = false,
      error: () => {
        this.errorMessage = 'Failed to load blogs.';
        this.loading = false;
      }
    });
  }
  }

  onPageChange(event: any) {
    this.pageIndex$.next(event.pageIndex);
  }

  delete(id: number): void {
    if (confirm('Are you sure you want to delete this blog?')) {
      this.blogService.delete(id).subscribe({
        error: () => this.errorMessage = 'Failed to delete blog.'
      });
    }
  }

  edit(id: number): void {
    this.router.navigate(['/edit', id]);
  }

  create(): void {
    this.router.navigate(['/create']);
  }

  toggleSelectMode(): void {
    this.selectMode = !this.selectMode;
    if (!this.selectMode) {
      this.selectedBlogs.clear(); // clear selection when exiting select mode
    }
  }

  toggleBlogSelection(id: number): void {
    if (this.selectedBlogs.has(id)) {
      this.selectedBlogs.delete(id);
    } else {
      this.selectedBlogs.add(id);
    }
  }

  deleteSelected(): void {
    const count = this.selectedBlogs.size;
    if (count === 0) return;

    if (confirm(`Are you sure you want to delete ${count} blog(s)?`)) {
      // Delete each selected blog
      this.selectedBlogs.forEach(id => {
        this.blogService.delete(id).subscribe({
          error: () => this.errorMessage = `Failed to delete blog with ID ${id}`
        });
      });
      this.selectedBlogs.clear();
      this.selectMode = false;
    }
  }

  isSelected(id: number): boolean {
    return this.selectedBlogs.has(id);
  }
}