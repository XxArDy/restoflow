import {
  Component,
  inject,
  input,
  OnChanges,
  output,
  SimpleChanges,
} from '@angular/core';
import { Observable } from 'rxjs';
import { FilterService } from 'src/app/shared/data-access/helpers/filter.service';
import { CategoryService } from 'src/app/shared/data-access/restaurant/category.service';
import { AuthService } from 'src/app/shared/data-access/user/auth.service';
import { ICategory } from 'src/app/shared/model/product/category';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-category-list',
  template: ` <div class="category-list__header">
      <button-primary
        *ngIf="authService.isItUserRestaurant(restaurantId())"
        name="Create category"
        (click)="createCategory.emit()"
      ></button-primary>
      <search-primary [filterService]="filterService"></search-primary>
      <pagination-buttons
        (leftArrow)="filterService.changePage(-1)"
        (rightArrow)="filterService.changePage(1)"
      ></pagination-buttons>
    </div>
    <div class="category-list__body">
      <div
        *ngFor="let category of filteredList | async"
        class="category-list__item"
      >
        <div class="category-list__item-name">
          {{ category.name }}
        </div>
        <div class="category-list__item-buttons">
          <button-edit
            (click)="this.editCategory.emit(category.id)"
          ></button-edit>
          <button-delete
            (click)="onDeleteCategory(category.id)"
          ></button-delete>
        </div>
      </div>
    </div>`,
  styleUrls: ['./category-list.component.scss'],
  standalone: true,
  imports: [SharedModule],
  providers: [FilterService],
})
export class CategoryListComponent implements OnChanges {
  categories = input.required<Observable<ICategory[]> | null>();
  restaurantId = input<number | null>(null);

  updateCategories = output<void>();
  editCategory = output<number>();
  createCategory = output<void>();

  filteredList: Observable<ICategory[]> | null = null;

  filterService = inject(FilterService);
  authService = inject(AuthService);
  private _categoryService = inject(CategoryService);

  ngOnChanges(changes: SimpleChanges): void {
    if (this.categories() !== null) {
      this.filteredList = this.filterService.filter(this.categories()!);
    }
  }

  async onDeleteCategory(id: number): Promise<void> {
    if (await this._categoryService.deleteCategory(id))
      this.updateCategories.emit();
  }
}
