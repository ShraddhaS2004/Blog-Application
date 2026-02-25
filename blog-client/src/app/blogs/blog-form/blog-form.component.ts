import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { Blog } from '../../models/blog';

@Component({
  selector: 'app-blog-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './blog-form.component.html',
  styleUrls: ['./blog-form.component.css']
})
export class BlogFormComponent implements OnInit {

  blog: Blog = {
    name: '',
    description: '',
    author: ''
  };

  isEditMode = false;

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode = true;
      this.blogService.getById(+id).subscribe(data => {
        this.blog = data;
      });
    }
  }

  onSubmit() {
    if (this.isEditMode) {
      this.blogService.update(this.blog.id!, this.blog)
        .subscribe(() => this.router.navigate(['/']));
    } else {
      this.blogService.create(this.blog)
        .subscribe(() => this.router.navigate(['/']));
    }
  }
}