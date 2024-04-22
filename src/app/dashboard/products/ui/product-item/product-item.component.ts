import { Component, inject, input, output } from '@angular/core';
import { ROLES_CONFIG } from 'src/app/shared/configs/app-role';
import { ProductService } from 'src/app/shared/data-access/product/product.service';
import { AuthService } from 'src/app/shared/data-access/user/auth.service';
import { IProductContent } from 'src/app/shared/model/product/product-content';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConversationBonusComponent } from './conversation-bonus/conversation-bonus.component';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
  standalone: true,
  imports: [SharedModule, ConversationBonusComponent],
})
export class ProductItemComponent {
  product = input.required<IProductContent | null>();

  edit = output<number>();
  updateProducts = output<void>();

  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: false,
    infinite: true,
    swipe: true,
    touchMove: true,
    draggable: true,
  };

  get ROLES_CONFIG() 
  {
    return ROLES_CONFIG;
  }

  authService = inject(AuthService);
  private _productService = inject(ProductService);

  async onDeleteProduct(): Promise<void> {
    if (
      await this._productService.deleteProduct(
        this.product()?.productDto.id ?? 0
      )
    )
      this.updateProducts.emit();
  }
}
