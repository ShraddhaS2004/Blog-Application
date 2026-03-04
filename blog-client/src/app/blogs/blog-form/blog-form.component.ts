import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { Blog } from '../../models/blog';
import { MaterialModule } from '../../material/material.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CanDeactivate } from '@angular/router';

@Component({
  selector: 'app-blog-form',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
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
  formChanged = false;
  isNewBlog=false;

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.isNewBlog=!id;

    if (id) {
      this.isEditMode = true;
      this.blogService.getById(+id).subscribe(data => {
        this.blog = data;
      });
    }
  }

  // CanDeactivate Guard logic to warn the user about unsaved changes
  // canDeactivate(): boolean {
  //   if (this.formChanged) {
  //     return confirm('You have unsaved changes. Do you want to save them?');
  //   }
  //   return true;
  // }

  onCancel() {
    //if (this.formChanged && !this.isNewBlog) {
    //   const confirmCancel = confirm('You have unsaved changes. Do you want to discard them?');
    //   if (confirmCancel) {
    //     this.router.navigate(['/']);
    //   }
    // } else {
    //   this.router.navigate(['/']);
    // }
    this.router.navigate(['/']);
  }

  onSubmit() {
    if (this.isEditMode) {
      this.blogService.update(this.blog.id!, this.blog).subscribe(() => {
        this.formChanged = false;
        this.snackBar.open('Blog updated successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });
        this.router.navigate(['/']);
      });
    } else {
      this.blogService.create(this.blog).subscribe(() => {
        this.formChanged = false;
        this.snackBar.open('Blog saved successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });
        this.router.navigate(['/']);
      });
    }
  }

  // Track changes in the form to set formChanged to true
  onInputChange() {
    if (this.isEditMode) {
      this.formChanged = true;
    }
  }
}