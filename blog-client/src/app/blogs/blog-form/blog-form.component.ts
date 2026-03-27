import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { Blog } from '../../models/blog';
import { MaterialModule } from '../../material/material.module';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-blog-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './blog-form.component.html',
  styleUrls: ['./blog-form.component.css']
})
export class BlogFormComponent implements OnInit {

  blogForm!: FormGroup;

  isEditMode = false;
  isNewBlog = false;

  initialFormValue: any;

  blogId!: number;

  ignoreGuard = false;

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {}

  genres: string[] = [
  'Tech',
  'Lifestyle',
  'Health & Wellness',
  'Travel',
  'Cooking',
  'Sports',
  'Education',
  'Finance',
  'Personal Development',
  'Business and Startups'
];

  ngOnInit(): void {

    this.blogForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      description: ['', Validators.required],
      author: ['', Validators.required],
      genre: ['', Validators.required]
    });

    const id = this.route.snapshot.paramMap.get('id');
    this.isNewBlog = !id;

    if (id) {
      this.isEditMode = true;
      this.blogId = +id;

      this.blogService.getById(this.blogId).subscribe(data => {

        this.blogForm.patchValue({
          id: data.id,
          name: data.name,
          description: data.description,
          author: data.author,
          genre: data.genre
        });

        // store initial value
        this.initialFormValue = this.blogForm.getRawValue();
      });

    } else {
      this.initialFormValue = this.blogForm.getRawValue();
    }
  }

  hasFormChanged(): boolean {
const normalize = (obj: any) => {
    const result: any = {};
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      if (typeof value === 'string') {
        result[key] = value.trim();
      } else {
        result[key] = value;
      }
    });
    return result;
  };

  const initial = normalize(this.initialFormValue);
  const current = normalize(this.blogForm.getRawValue());

  return JSON.stringify(initial) !== JSON.stringify(current);
  }

  /**
   * Cancel button
   */
  onCancel() {

    // if (this.hasFormChanged()) {

    //   const confirmDiscard = confirm(
    //     'You have unsaved changes. Do you want to discard them?'
    //   );

    //   if (!confirmDiscard) {
    //     return;
    //   }
    // }

    this.router.navigate(['/']);
  }

  /**
   * Submit form
   */
  onSubmit() {

    // if (!this.hasFormChanged()) {

    //   this.snackBar.open('No changes detected!', 'Close', {
    //     duration: 2000
    //   });

    //   setTimeout(() => {
    //   this.router.navigate(['/']);
    // }, 500);

    //   return;
    // }

    // const formValue = this.blogForm.getRawValue();

    // if (this.isEditMode) {

    //   //const id = this.route.snapshot.paramMap.get('id');

    //   this.blogService.update(formValue.id, formValue).subscribe(() => {

    //     this.snackBar.open('Blog updated successfully!', 'Close', {
    //       duration: 3000,
    //       panelClass: ['success-snackbar'],
    //     });

    //     this.initialFormValue = this.blogForm.getRawValue();

    //     this.router.navigate(['/']);
    //   });

    // } else {

    //   this.blogService.create(formValue).subscribe(() => {

    //     this.snackBar.open('Blog saved successfully!', 'Close', {
    //       duration: 3000,
    //       panelClass: ['success-snackbar'],
    //     });

    //     this.initialFormValue = this.blogForm.getRawValue();

    //     this.router.navigate(['/']);
    //   });
    // }
    if (!this.hasFormChanged()) {

    this.snackBar.open('No changes detected!', 'Close', {
      duration: 2000
    });
    this.ignoreGuard = true; // bypass guard
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 500);

    return;
  }

  const formValue = this.blogForm.getRawValue();

   if (this.isEditMode) {
    this.blogService.stageUpsert(formValue);
    this.ignoreGuard = true; // bypass guard
    this.blogService.setEditMode(true);
    this.router.navigate(['/']); 
  } else {
    // Stage creation
    this.blogService.stageUpsert(formValue);
    this.ignoreGuard = true;
    this.blogService.setEditMode(true);
    this.router.navigate(['/']);
  }
  }
}