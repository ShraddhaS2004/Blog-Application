import { Routes } from '@angular/router';
import { BlogListComponent } from './blogs/blog-list/blog-list.component';
import { BlogFormComponent } from './blogs/blog-form/blog-form.component';

export const routes: Routes = [
  { path: '', component: BlogListComponent },
  { path: 'create', component: BlogFormComponent },
  { path: 'edit/:id', component: BlogFormComponent },
  {path: '**', redirectTo: '' }
];