import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { Blog } from '../../models/blog';
import { ChangeDetectorRef } from '@angular/core';
import { MaterialModule } from '../../material/material.module';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent implements OnInit {

  blogs: Blog[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private blogService: BlogService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.loading = true;

    this.blogService.getAll().subscribe({
      next: (data) => {
        this.blogs = Array.isArray(data) ? data : data ? [data] : [];
        this.loading = false;
        this.cd.markForCheck();
      },
      error: (err) => {
        this.errorMessage = 'Failed to load blogs.';
        this.loading = false;
        this.cd.markForCheck();
      }
    });
  }

  delete(id: number): void {
    if (confirm('Are you sure you want to delete this blog?')) {
      this.blogService.delete(id).subscribe(() => this.loadBlogs());
    }
  }

  edit(id: number): void {
    this.router.navigate(['/edit', id]);
  }

  create(): void {
    this.router.navigate(['/create']);
  }
}