import { inject, Injectable, ViewContainerRef } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  switchMap,
} from 'rxjs';
import { ProductCreateComponent } from 'src/app/dashboard/products/ui/product-create-edit/product-create.component';
import { ProductEditComponent } from 'src/app/dashboard/products/ui/product-create-edit/product-edit.component';
import { IProductContent } from 'src/app/shared/model/product/product-content';
import { IRestaurant } from '../../model/restaurant/restaurant';
import { RestaurantService } from '../restaurant/restaurant.service';
import { ProductsComponent } from './../../../dashboard/products/products.component';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root',
})
export class ProductHelperService {
  restaurantList$: Observable<IRestaurant[]> | null = null;
  productList$: Observable<IProductContent[]> | null = null;

  isModalOpen = false;

  private _selectedRestaurantId = new BehaviorSubject<number>(-1);

  set selectedRestaurantId(value: number) {
    this._selectedRestaurantId.next(value);
  }

  get selectedRestaurantId() {
    return this._selectedRestaurantId.getValue();
  }

  private _productService = inject(ProductService);
  private _restaurantService = inject(RestaurantService);

  init() {
    this.restaurantList$ = this._restaurantService.getAllRestaurants();
    this.productList$ = this._getProductList();
  }

  async onOpenModal(
    type: 'create' | 'update',
    id: number = 0,
    modalContent: ViewContainerRef,
    productsComponent: ProductsComponent
  ): Promise<void> {
    modalContent.clear();

    switch (type) {
      case 'create':
        const createModal = modalContent.createComponent(
          ProductCreateComponent
        );
        createModal.instance.updateProducts.subscribe(() => {
          productsComponent.updateProduct();
          this.closeModal();
        });
        createModal.setInput('restaurantId', this.selectedRestaurantId);
        break;
      case 'update':
        const updateModal = modalContent.createComponent(ProductEditComponent);
        updateModal.instance.updateProducts.subscribe(() => {
          productsComponent.updateProduct();
          this.closeModal();
        });
        updateModal.setInput('restaurantId', this.selectedRestaurantId);
        updateModal.setInput(
          'product',
          await this._productService.getProductById(id)
        );

        break;
    }

    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  private _getProductList(): Observable<IProductContent[]> {
    return combineLatest([this._selectedRestaurantId]).pipe(
      switchMap(([selectedRestaurantId]) =>
        this._productService
          .getAllProduct(selectedRestaurantId)
          .pipe(map((res) => res.dtos))
      )
    );
  }
}
