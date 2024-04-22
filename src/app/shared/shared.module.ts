import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  OwlDateTimeModule,
  OwlNativeDateTimeModule,
} from '@danielmoncada/angular-datetime-picker';
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
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    SlickCarouselModule,
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
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    SelectRestaurantComponent,
    SlickCarouselModule,
    ConfirmDialogComponent,
    SearchPrimaryComponent,
    AutoFocusDirective,
  ],
})
export class SharedModule {}
