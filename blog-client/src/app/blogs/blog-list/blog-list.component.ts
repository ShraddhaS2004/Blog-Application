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
import { take, of } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { switchMap } from 'rxjs/operators';

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

  pendingDeletes = new Set<number>();
  hasChanges = false;

  pendingUpserts: Blog[] = [];

  constructor(
    private blogService: BlogService,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.blogs$ = this.blogService.blogs$;

    this.blogService.stagedUpserts$.subscribe(staged => {
    this.pendingUpserts = staged; // get staged upserts
    this.hasChanges = staged.length > 0 || this.pendingDeletes.size > 0;
  });

    this.genres$ = this.blogs$.pipe(
      map(blogs => [...new Set(blogs.map(b => b.genre).filter(Boolean))])
    );

    this.filteredBlogs$ = combineLatest([
      this.blogs$,
      this.selectedGenre$
    ]).pipe(
      map(([blogs, genre]) => {
        if (!genre) return blogs;
        return blogs.filter(b => b.genre === genre);
      })
    );

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

    this.blogService.pendingDeletes$.subscribe(deletes => {
  this.hasChanges = deletes.length > 0 || this.pendingUpserts.length > 0;
});

    const nav = this.router.getCurrentNavigation();
  const blogDraft = nav?.extras?.state?.['blogDraft'];

  if (blogDraft) {

    this.blogService.stageUpsert(blogDraft);

  this.hasChanges = true;
    if (blogDraft.id) {
      this.pendingUpserts = this.pendingUpserts.filter(b => b.id !== blogDraft.id);
      this.pendingUpserts.push(blogDraft);

      this.blogs$.pipe(take(1)).subscribe(blogs => {
        const updated = blogs.map(b =>
          b.id === blogDraft.id ? blogDraft : b
        );
        this.updateBlogs(updated);
      });

    } else {

      this.pendingUpserts.push(blogDraft);

      this.blogs$.pipe(take(1)).subscribe(blogs => {
        this.updateBlogs([blogDraft, ...blogs]);
      });
    }
  }
  }

  onGenreChange(value: string): void {
    this.selectedGenre$.next(value);
    this.pageIndex$.next(0);

    this.paginator?.firstPage();
  }

  onPageChange(event: any): void {
    this.pageIndex$.next(event.pageIndex);
  }

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

  delete(id: number): void {
    if (this.pendingDeletes.has(id)) return;

  if (confirm('Are you sure you want to delete this blog?')) {

    this.blogService.addDelete(id);

    this.blogs$.pipe(take(1)).subscribe(blogs => {
      const updated = blogs.filter(b => b.id !== id);
      this.updateBlogs(updated);
    });

    this.hasChanges = true; // ensure UI updates
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

    const idsToDelete = Array.from(this.selectedBlogs);

    idsToDelete.forEach(id =>
      this.blogService.addDelete(id)
    );

    //this.hasChanges = true;

    this.blogs$.pipe(take(1)).subscribe(blogs => {
      const updated = blogs.filter(b => !idsToDelete.includes(b.id!));
      this.updateBlogs(updated);

  //     setTimeout(() => {
  //   this.updateBlogs(updated);
  //   this.hasChanges = true;
  // });

  this.hasChanges = true;
    this.selectedBlogs.clear();
    this.selectMode = false;
    });

    

    this.selectedBlogs.clear();
    this.selectMode = false;
  }
  }

  isSelected(id: number): boolean {
    return this.selectedBlogs.has(id);
  }

  onBlogStaged(blog: Blog) {
  this.blogService.stageUpsert(blog);

  this.hasChanges = true;

  this.paginator?.firstPage();
}
  saveChanges(): void {
  const deletes = this.blogService.getDeletes();
  const upserts = this.pendingUpserts.filter(
  b => !deletes.includes(b.id!)
);

  console.log('Deletes sent to API:', deletes);
  console.log('Upserts:', upserts);

  if (deletes.length === 0 && upserts.length === 0){ 
    this.snackBar.open('No changes to save', 'Close', { duration: 3000 });
    this.hasChanges = false;
    return};

  this.loading = true;

  const delete$: Observable<any> = deletes.length > 0
    ? this.blogService.deleteMultiple(deletes)
    : of(null);

  delete$
    .pipe(
      switchMap(() : Observable<any> => {
        if (upserts.length > 0) {
          return this.blogService.upsert(upserts);
        }
        return of(null);
      })
    )
    .subscribe({
      next: () => this.finalizeSave(),
      error: () => this.showError()
    });
}

private finalizeSave = () => {
  this.blogService.clearDeletes();
  this.pendingUpserts = [];
  this.blogService.clearStaged();

  this.snackBar.open('All changes saved!', 'Close', { duration: 3000 });

  //this.loadAllBlogs();
  this.hasChanges = false;
  this.loading = false;
  this.cdr.detectChanges();
};

private showError = () => {
  this.snackBar.open('Failed to save changes', 'Close', { duration: 3000 });
  this.loading = false;
};

cancelChanges(): void {
  if(confirm('Are you sure you want to discard all changes?')) {
  this.pendingDeletes.clear();
  this.hasChanges = false;

  this.loadAllBlogs(); // reload from backend

  this.cdr.detectChanges();
  }
}

isStaged(blog: Blog): boolean {
  return this.pendingUpserts.some(b => b.id === blog.id);
}

}