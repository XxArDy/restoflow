import { Component, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductService } from 'src/app/shared/data-access/product/product.service';
import { IProduct } from 'src/app/shared/model/product/product';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProductFormComponent } from './product-form.component';

@Component({
  selector: 'app-product-create',
  template: `<div class="form-container">
    <h1 class="form__title">{{ 'Products.Create' | translate }}</h1>
    <form
      [formGroup]="productForm"
      (ngSubmit)="onSubmit()"
      class="form"
      enctype="multipart/form-data"
    >
      <app-product-form [restaurantId]="restaurantId()"></app-product-form>
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
export class ProductCreateComponent implements OnInit {
  productForm!: FormGroup;

  restaurantId = input<number>(0);
  updateProducts = output<void>();

  private _productService = inject(ProductService);

  private _fb = inject(FormBuilder);

  ngOnInit(): void {
    this.productForm = this._fb.group({});
  }

  async onSubmit(): Promise<void> {
    let product: IProduct = {
      ...this.productForm.value,
    };
    product.ingredients = this.productForm
      .get('ingredients')
      ?.value?.split(',')
      .map((ingredient: string) => ingredient.trim());

    const fileList: FileList = this.productForm.get('images')?.value;

    const createdProduct = await this._productService.createProduct(product);
    if (createdProduct) {
      if (
        await this._productService.createProductImage(
          createdProduct.id,
          Array.from(fileList)
        )
      ) {
        this.updateProducts.emit();
      }
    }
  }
}
