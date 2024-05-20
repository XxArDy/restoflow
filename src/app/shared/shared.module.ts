import { CommonModule } from '@angular/common';
import { Injectable, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MAT_NATIVE_DATE_FORMATS,
  MatNativeDateModule,
  NativeDateAdapter,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { AutoFocusDirective } from './directives/auto-focus.directive';
import { ClickOutDirective } from './directives/click-out.directive';
import { ClickToFocusDirective } from './directives/click-to-focus.directive';
import { DisableDirective } from './directives/disable.directive';
import { SideBarComponent } from './feature/side-bar/side-bar.component';
import { ButtonDeleteComponent } from './ui/button-delete/button-delete.component';
import { ButtonEditComponent } from './ui/button-edit/button-edit.component';
import { ButtonPrimaryComponent } from './ui/button-primary/button-primary.component';
import { ConfirmDialogComponent } from './ui/confirm-dialog/confirm-dialog.component';
import { ModalWindowComponent } from './ui/modal-window/modal-window.component';
import { PaginationButtonsComponent } from './ui/pagination-buttons/pagination-buttons.component';
import { SearchPrimaryComponent } from './ui/search-primary/search-primary.component';
import { SelectRestaurantComponent } from './ui/select-restaurant/select-restaurant.component';

@Injectable()
class UkrainianDateAdapter extends NativeDateAdapter {
  override getFirstDayOfWeek(): number {
    return 1;
  }
}

@NgModule({
  declarations: [
    SideBarComponent,
    ButtonPrimaryComponent,
    ModalWindowComponent,
    ClickOutDirective,
    ButtonDeleteComponent,
    ButtonEditComponent,
    PaginationButtonsComponent,
    ClickToFocusDirective,
    DisableDirective,
    SelectRestaurantComponent,
    ConfirmDialogComponent,
    SearchPrimaryComponent,
    AutoFocusDirective,
  ],
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    ReactiveFormsModule,
    SlickCarouselModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TranslateModule,
  ],
  exports: [
    SideBarComponent,
    ButtonPrimaryComponent,
    ModalWindowComponent,
    ClickOutDirective,
    CommonModule,
    ButtonDeleteComponent,
    ButtonEditComponent,
    PaginationButtonsComponent,
    ReactiveFormsModule,
    ClickToFocusDirective,
    DisableDirective,
    SelectRestaurantComponent,
    SlickCarouselModule,
    ConfirmDialogComponent,
    SearchPrimaryComponent,
    AutoFocusDirective,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TranslateModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'uk-UA' },
    // provideNativeDateAdapter(),
    { provide: DateAdapter, useClass: UkrainianDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
  ],
})
export class SharedModule {}
