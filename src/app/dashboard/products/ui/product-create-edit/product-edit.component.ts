import { Component, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductService } from 'src/app/shared/data-access/product/product.service';
import { IProduct } from 'src/app/shared/model/product/product';
import { IProductContent } from 'src/app/shared/model/product/product-content';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProductFormComponent } from './product-form.component';

@Component({
  selector: 'app-product-edit',
  template: `<div class="form-container">
    <h1 class="form__title">{{ 'Products.Edit' | translate }}</h1>
    <form
      [formGroup]="productForm"
      (ngSubmit)="onSubmit()"
      class="form"
      enctype="multipart/form-data"
    >
      <app-product-form
        [restaurantId]="restaurantId()"
        [productValue]="product()"
      ></app-product-form>
      <div class="form__btn">
        <button type="submit" class="form__submit">
          {{ 'Form.Submit' | translate }}
        </button>
      </div>
    </form>
  </div> `,
  standalone: true,
  imports: [SharedModule, ProductFormComponent],
})
export class ProductEditComponent implements OnInit {
  productForm!: FormGroup;

  restaurantId = input<number>(0);
  product = input<IProductContent>();
  updateProducts = output<void>();

  private _productService = inject(ProductService);

  private _fb = inject(FormBuilder);

  ngOnInit(): void {
    this.productForm = this._fb.group({});
  }

  async onSubmit(): Promise<void> {
    let tempProduct: IProduct = {
      id: this.productForm.get('id')?.value || this.product()?.productDto.id,
      name: this.productForm.get('name')?.value,
      description: this.productForm.get('description')?.value,
      categoryId: this.productForm.get('categoryId')?.value,
      price: this.productForm.get('price')?.value,
      quantity: this.productForm.get('quantity')?.value,
      measurmentUnitId: this.productForm.get('measurmentUnitId')?.value,
      restaurantId: this.productForm.get('restaurantId')?.value,
      ingredients: this.productForm
        .get('ingredients')
        ?.value?.split(',')
        .map((ingredient: string) => ingredient.trim()),
      cookingTime: this.productForm.get('cookingTime')?.value,
      bonusPoints: this.productForm.get('bonusPoints')?.value,
    };

    await this._productService.updateProduct(tempProduct);
    await this._productService.createProductImage(
      tempProduct.id,
      this.productForm.get('images')?.value as File[]
    );

    this.updateProducts.emit();
  }
}
