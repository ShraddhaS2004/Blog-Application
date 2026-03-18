import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BlogService } from '../../services/blog.service';
import { Blog } from '../../models/blog';
import { MaterialModule } from '../../material/material.module';
import { Observable, BehaviorSubject, combineLatest, map } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, FormsModule],
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent implements OnInit {

  blogs$!: Observable<Blog[]>;
  filteredBlogs$!: Observable<Blog[]>;
  paginatedBlogs$!: Observable<Blog[]>;

  pageSize = 6;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private pageIndex$ = new BehaviorSubject<number>(0);
  private selectedGenre$ = new BehaviorSubject<string>('');

  genres$!: Observable<string[]>;

  loading = false;
  errorMessage = '';

  searchTerm: string = '';

  selectMode = false;
  selectedBlogs = new Set<number>();

  

  constructor(
    private blogService: BlogService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {

    this.blogs$ = this.blogService.blogs$;

    // ✅ Extract unique genres
    this.genres$ = this.blogs$.pipe(
      map(blogs => [...new Set(blogs.map(b => b.genre).filter(Boolean))])
    );

    // ✅ Filtered blogs (reactive)
    this.filteredBlogs$ = combineLatest([
      this.blogs$,
      this.selectedGenre$
    ]).pipe(
      map(([blogs, genre]) => {
        if (!genre) return blogs;
        return blogs.filter(b => b.genre === genre);
      })
    );

    // ✅ Paginated blogs (after filtering)
    this.paginatedBlogs$ = combineLatest([
      this.filteredBlogs$,
      this.pageIndex$
    ]).pipe(
      map(([blogs, pageIndex]) => {
        const start = pageIndex * this.pageSize;
        const end = start + this.pageSize;
        return blogs.slice(start, end);
      })
    );

    // ✅ Initial load
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

  // ✅ Genre filter change
  onGenreChange(value: string): void {
    this.selectedGenre$.next(value);
    this.pageIndex$.next(0);

    this.paginator?.firstPage();
  }

  // ✅ Pagination
  onPageChange(event: any): void {
    this.pageIndex$.next(event.pageIndex);
  }

  // ✅ Search
  searchBlogs(): void {
    if (!this.searchTerm.trim()) {
      this.loadAllBlogs();
      return;
    }

    this.loading = true;

    this.blogService.search(this.searchTerm).subscribe({
      next: (blogs) => {
        this.loading = false;
        this.updateBlogs(blogs);
        this.pageIndex$.next(0);
      },
      error: (error) => {
        this.loading = false;

        if (error.status === 404) {
          this.snackBar.open(
            "The blog you're looking for doesn't exist.",
            'Close',
            { duration: 3000 }
          );
        } else {
          this.snackBar.open(
            'Something went wrong while searching blogs.',
            'Close',
            { duration: 3000 }
          );
        }
      }
    });
  }

  onSearchInputChange(): void {
    if (!this.searchTerm.trim()) {
      this.loadAllBlogs();
    }
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.loadAllBlogs();
  }

  private loadAllBlogs(): void {
    this.loading = true;

    this.blogService.loadAll().subscribe({
      next: () => {
        this.loading = false;
        this.pageIndex$.next(0);
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Failed to load blogs.', 'Close', {
          duration: 3000
        });
      }
    });
  }

  private updateBlogs(blogs: Blog[]): void {
    (this.blogService as any).blogsSubject.next(blogs);
  }

  // ✅ CRUD Actions
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

  // ✅ Multi-select mode
  toggleSelectMode(): void {
    this.selectMode = !this.selectMode;

    if (!this.selectMode) {
      this.selectedBlogs.clear();
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