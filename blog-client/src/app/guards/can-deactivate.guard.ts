import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { BlogFormComponent } from '../blogs/blog-form/blog-form.component';

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<BlogFormComponent> {

  canDeactivate(component: BlogFormComponent): boolean {
    if (component.formChanged) {
      return confirm('You have unsaved changes. Do you want to discard them?');
    }
    return true;
  }
}