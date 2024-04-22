import {
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  ViewChild,
} from '@angular/core';
import { ProductService } from 'src/app/shared/data-access/product/product.service';
import { IProduct } from 'src/app/shared/model/product/product';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'conversation-bonus',
  templateUrl: './conversation-bonus.component.html',
  styleUrls: ['./conversation-bonus.component.scss'],
  standalone: true,
  imports: [SharedModule],
})
export class ConversationBonusComponent {
  product = input.required<IProduct | undefined>();
  @ViewChild('editor') editor: ElementRef<HTMLDivElement> | undefined;

  isEditing: boolean = false;

  private _productService = inject(ProductService);

  @HostListener('keydown.esc')
  cancel(): void {
    this.isEditing = false;
  }

  edit(): void {
    this.isEditing = true;
  }

  apply(e?: Event): void {
    e?.preventDefault();
    const newBonus = String(this.editor?.nativeElement.textContent).trim();
    console.log(newBonus);
    if (!isNaN(Number(newBonus))) {
      this._setBonus(Number(newBonus));
      this.cancel();
    } else {
      console.error('Bonus must be a number');
    }
  }

  numericInput(event: KeyboardEvent): void {
    const pattern = /[0-9\.\ ]/;
    let inputChar = event.key;

    if (
      !pattern.test(inputChar) &&
      ![
        'Backspace',
        'Delete',
        'ArrowRight',
        'ArrowLeft',
        'ArrowUp',
        'ArrowDown',
      ].includes(event.key)
    ) {
      event.preventDefault();
    }
  }

  private async _setBonus(bonus: number): Promise<void> {
    if (this.product()) {
      let tempProduct = this.product()!;
      tempProduct.bonusPoints = bonus;
      this._productService.updateProduct(tempProduct);
    }
  }
}
