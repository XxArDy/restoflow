import {
  Component,
  inject,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Observable } from 'rxjs';
import { ROLES_CONFIG } from 'src/app/shared/configs/app-role';
import { FilterService } from 'src/app/shared/data-access/helpers/filter.service';
import { ProductHelperService } from 'src/app/shared/data-access/product/product-helper.service';
import { AuthService } from 'src/app/shared/data-access/user/auth.service';
import { IProductContent } from 'src/app/shared/model/product/product-content';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProductItemComponent } from './ui/product-item/product-item.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  standalone: true,
  imports: [SharedModule, ProductItemComponent],
  providers: [FilterService],
})
export class ProductsComponent implements OnInit {
  @ViewChild('modalContent', { read: ViewContainerRef })
  modalContent!: ViewContainerRef;

  get ROLES_CONFIG() {
    return ROLES_CONFIG;
  }

  filteredProductList$: Observable<IProductContent[]> | null = null;

  authService = inject(AuthService);
  productHelperService = inject(ProductHelperService);
  filterService = inject(FilterService);

  ngOnInit() {
    this.productHelperService.init();
    this.productHelperService.selectedRestaurantId =
      this.authService.currentUser?.restaurantId ?? -1;
    this.filterService.pageElement = 8;
    this.updateProduct();
  }

  updateProduct(): void {
    this.filteredProductList$ = this.filterService.filter(
      this.productHelperService.productList$
    );
  }

  onOpenModal(type: 'create' | 'update', id: number = 0): void {
    this.productHelperService.onOpenModal(type, id, this.modalContent, this);
  }

  updateQuery(query: string): void {
    this.filterService.setQuery(query);
  }
}
