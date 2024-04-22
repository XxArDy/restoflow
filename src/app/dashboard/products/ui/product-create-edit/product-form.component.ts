import {
  Component,
  inject,
  input,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ControlContainer, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { ProductService } from 'src/app/shared/data-access/product/product.service';
import { CategoryService } from 'src/app/shared/data-access/restaurant/category.service';
import { UnitsService } from 'src/app/shared/data-access/restaurant/units.service';
import { ICategory } from 'src/app/shared/model/product/category';
import { IProduct } from 'src/app/shared/model/product/product';
import { IProductContent } from 'src/app/shared/model/product/product-content';
import { IUnit } from 'src/app/shared/model/product/unit';
import { IRestaurantImage } from 'src/app/shared/model/restaurant/restaurant-image';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [SharedModule],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  templateUrl: './product-form.component.html',
})
export class ProductFormComponent implements OnInit, OnDestroy {
  @Input() set productValue(value: IProductContent | undefined) {
    this.product = value?.productDto;
    if (this.product) this._updateProduct(value);
  }

  restaurantId = input<number>(0);

  units: Observable<IUnit[]> | null = null;
  categories: Observable<ICategory[]> | null = null;

  parentContainer = inject(ControlContainer);

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  isEditing = false;
  productImages: IRestaurantImage[] = [];

  product: IProduct | undefined = {
    id: 0,
    name: '',
    description: '',
    categoryId: 0,
    price: 0,
    quantity: 0,
    measurmentUnitId: 0,
    restaurantId: 0,
    ingredients: [],
    cookingTime: 0,
    bonusPoints: 0,
  };

  private _unitsService = inject(UnitsService);
  private _categoryService = inject(CategoryService);
  private _productService = inject(ProductService);

  ngOnInit() {
    this.units = this._unitsService.getAllUnits();
    this.categories = this._categoryService.getAllCategories(
      this.restaurantId()
    );
    this.parentFormGroup.addControl('id', new FormControl(this.product?.id));
    this.parentFormGroup.addControl(
      'name',
      new FormControl(this.product?.name)
    );
    this.parentFormGroup.addControl(
      'description',
      new FormControl(this.product?.description)
    );
    this.parentFormGroup.addControl(
      'categoryId',
      new FormControl(this.product?.categoryId)
    );
    this.parentFormGroup.addControl(
      'price',
      new FormControl(this.product?.price)
    );
    this.parentFormGroup.addControl(
      'quantity',
      new FormControl(this.product?.quantity)
    );
    this.parentFormGroup.addControl(
      'measurmentUnitId',
      new FormControl(this.product?.measurmentUnitId)
    );
    this.parentFormGroup.addControl(
      'restaurantId',
      new FormControl(this.restaurantId())
    );
    this.parentFormGroup.addControl(
      'ingredients',
      new FormControl(this.product?.ingredients.join(','))
    );
    this.parentFormGroup.addControl(
      'cookingTime',
      new FormControl(this.product?.cookingTime)
    );
    this.parentFormGroup.addControl(
      'bonusPoints',
      new FormControl(this.product?.bonusPoints)
    );
    this.parentFormGroup.addControl('images', new FormControl([]));
  }

  ngOnDestroy(): void {
    this.parentFormGroup.removeControl('id');
    this.parentFormGroup.removeControl('name');
    this.parentFormGroup.removeControl('description');
    this.parentFormGroup.removeControl('categoryId');
    this.parentFormGroup.removeControl('price');
    this.parentFormGroup.removeControl('quantity');
    this.parentFormGroup.removeControl('measurmentUnitId');
    this.parentFormGroup.removeControl('restaurantId');
    this.parentFormGroup.removeControl('ingredients');
    this.parentFormGroup.removeControl('cookingTime');
    this.parentFormGroup.removeControl('bonusPoints');
    this.parentFormGroup.removeControl('images');
  }

  private _updateProduct(value: IProductContent | undefined) {
    this.isEditing = true;
    this.productImages = value?.imageDto || [];
    this.parentFormGroup.get('id')?.setValue(this.product?.id);
    this.parentFormGroup.get('name')?.setValue(this.product?.name);
    this.parentFormGroup
      .get('description')
      ?.setValue(this.product?.description);
    this.parentFormGroup.get('categoryId')?.setValue(this.product?.categoryId);
    this.parentFormGroup.get('price')?.setValue(this.product?.price);
    this.parentFormGroup.get('quantity')?.setValue(this.product?.quantity);
    this.parentFormGroup
      .get('measurmentUnitId')
      ?.setValue(this.product?.measurmentUnitId);
    this.parentFormGroup
      .get('restaurantId')
      ?.setValue(this.product?.restaurantId);
    this.parentFormGroup
      .get('ingredients')
      ?.setValue(this.product?.ingredients.join(','));
    this.parentFormGroup
      .get('cookingTime')
      ?.setValue(this.product?.cookingTime);
    this.parentFormGroup
      .get('bonusPoints')
      ?.setValue(this.product?.bonusPoints);
  }

  onImageSelect(event: any) {
    const files: FileList = event.target.files;
    let images = this.parentFormGroup.get('images')?.value as File[];
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        images.push(files[i]);
      }
    }
  }

  async onDeleteImgButton(id: number): Promise<void> {
    if (await this._productService.deleteProductImage(id)) {
      this.productImages = this.productImages.filter(
        (image: IRestaurantImage) => image.id !== id
      );
    }
  }
}
