import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CategoryService } from 'src/app/shared/data-access/restaurant/category.service';
import { ICategory } from 'src/app/shared/model/product/category';

@Component({
  selector: 'app-category-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  template: `<div class="form-container">
    <h1 class="form__title">{{ 'Categories.Create' | translate }}</h1>
    <form [formGroup]="categoryForm" (ngSubmit)="onSubmit()" class="form">
      <div class="form__group">
        <label for="name" class="form__label">{{
          'Categories.Name' | translate
        }}</label>
        <input
          type="text"
          id="name"
          formControlName="name"
          class="form__input"
        />
      </div>
      <div class="form__btn">
        <button type="submit" class="form__submit">
          {{ 'Form.Submit' | translate }}
        </button>
      </div>
    </form>
  </div>`,
})
export class CategoryCreateComponent {
  categoryForm = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  restaurantId = input.required<number>();
  updateCategories = output<void>();

  private _categoryService = inject(CategoryService);

  async onSubmit(): Promise<void> {
    const category: ICategory = {
      id: 0,
      name: this.categoryForm.get('name')?.value ?? '',
      restaurantId: this.restaurantId(),
    };

    if (await this._categoryService.createCategory(category))
      this.updateCategories.emit();
  }
}
