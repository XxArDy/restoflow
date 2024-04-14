import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  input,
  OnChanges,
  output,
  SimpleChanges,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CategoryService } from 'src/app/shared/data-access/restaurant/category.service';
import { ICategory } from 'src/app/shared/model/product/category';

@Component({
  selector: 'app-category-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `<div class="form-container">
    <h1 class="form__title">Edit category</h1>
    <form [formGroup]="categoryForm" (ngSubmit)="onSubmit()" class="form">
      <div class="form__group">
        <label for="name" class="form__label">Name</label>
        <input
          type="text"
          id="name"
          formControlName="name"
          class="form__input"
        />
      </div>
      <div class="form__btn">
        <button type="submit" class="form__submit">Submit</button>
      </div>
    </form>
  </div>`,
})
export class CategoryEditComponent implements OnChanges {
  categoryForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  category = input.required<ICategory>();
  updateCategories = output<void>();

  private _categoryService = inject(CategoryService);

  ngOnChanges(change: SimpleChanges): void {
    this.categoryForm.patchValue({ name: this.category()?.name });
  }

  async onSubmit(): Promise<void> {
    const category: ICategory = {
      id: this.category()?.id,
      name: this.categoryForm.get('name')?.value ?? this.category()?.name,
      restaurantId: this.category()?.restaurantId,
    };

    if (await this._categoryService.updateCategory(category))
      this.updateCategories.emit();
  }
}
