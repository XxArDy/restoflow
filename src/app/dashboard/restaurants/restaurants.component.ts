import {
  Component,
  inject,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { CategoryService } from 'src/app/shared/data-access/restaurant/category.service';
import { RestaurantService } from 'src/app/shared/data-access/restaurant/restaurant.service';
import { UnitsService } from 'src/app/shared/data-access/restaurant/units.service';
import { AuthService } from 'src/app/shared/data-access/user/auth.service';
import { ICategory } from 'src/app/shared/model/product/category';
import { IUnit } from 'src/app/shared/model/product/unit';
import { IRestaurant } from 'src/app/shared/model/restaurant/restaurant';
import { SharedModule } from 'src/app/shared/shared.module';
import { ROLES_CONFIG } from '../../shared/configs/app-role';
import { CategoryListComponent } from './ui/category-list/category-list.component';
import { RestaurantEditComponent } from './ui/restaurant-create-edit/restaurant-edit.component';
import { UnitsListComponent } from './ui/units-list/units-list.component';

@Component({
  selector: 'app-restaurants',
  standalone: true,
  imports: [
    SharedModule,
    RestaurantEditComponent,
    CategoryListComponent,
    UnitsListComponent,
  ],
  templateUrl: './restaurants.component.html',
  styleUrl: './restaurants.component.scss',
})
export class RestaurantsComponent implements OnInit {
  @ViewChild('modalContent', { read: ViewContainerRef })
  modalContent!: ViewContainerRef;

  selectedRestaurantId: number = -1;

  restaurantList$: Observable<IRestaurant[]> | null = null;
  categoryList$: Observable<ICategory[]> | null = null;
  unitList$: Observable<IUnit[]> | null = null;

  get ROLES_CONFIG() {
    return ROLES_CONFIG;
  }

  get isModalOpen() {
    return this._restaurantService.isModalOpen;
  }

  authService = inject(AuthService);
  private _restaurantService = inject(RestaurantService);
  private _categoryService = inject(CategoryService);
  private _unitService = inject(UnitsService);

  ngOnInit(): void {
    if (this.authService.checkPermission([ROLES_CONFIG.superAdmin])) {
      this._getAllRestaurants();
      this.updateUnits();
    } else {
      this.selectedRestaurantId = this.authService.currentUser?.restaurantId!;
    }
    this.updateCategory();
  }

  updateSelectedRestaurant(): void {
    if (this.authService.checkPermission([ROLES_CONFIG.superAdmin])) {
      this._getAllRestaurants();
    }

    this.updateCategory();
  }

  updateCategory(): void {
    if (this.selectedRestaurantId === -1) return;
    this.categoryList$ = this._categoryService.getAllCategories(
      this.selectedRestaurantId
    );
  }

  updateUnits(): void {
    this.unitList$ = this._unitService.getAllUnits();
  }

  onRestaurantChange(target: number): void {
    this.selectedRestaurantId = target;
    this.updateSelectedRestaurant();
  }

  openModal(name: 'restaurant' | 'units' | 'category', id: number = 0): void {
    this._restaurantService.openModal(this.modalContent, name, id, this);
  }

  private _getAllRestaurants(): void {
    this.restaurantList$ = this._restaurantService.getAllRestaurants().pipe(
      switchMap((res) => {
        if (
          res.length > 0 &&
          (this.selectedRestaurantId === -1 ||
            !res.some((rest) => rest.id === this.selectedRestaurantId))
        ) {
          this.selectedRestaurantId = res[0].id ?? -1;
          this.updateCategory();
        }
        return of(res);
      })
    );
  }

  closeModal(): void {
    this.modalContent.clear();
    this._restaurantService.isModalOpen = false;
  }
}
