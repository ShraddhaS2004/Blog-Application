import { Routes } from '@angular/router';
import { BlogListComponent } from './blogs/blog-list/blog-list.component';
import { BlogFormComponent } from './blogs/blog-form/blog-form.component';
import { CanDeactivateGuard } from './guards/can-deactivate.guard';

export const routes: Routes = [
  { path: '', component: BlogListComponent },
  { path: 'create', component: BlogFormComponent, canDeactivate: [CanDeactivateGuard] },
  { path: 'edit/:id', component: BlogFormComponent, canDeactivate: [CanDeactivateGuard] },
  {path: '**', redirectTo: '' }
];