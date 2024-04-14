import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ClickOutDirective } from './directives/click-out.directive';
import { ClickToFocusDirective } from './directives/click-to-focus.directive';
import { DisableDirective } from './directives/disable.directive';
import { SideBarComponent } from './feature/side-bar/side-bar.component';
import { ButtonDeleteComponent } from './ui/button-delete/button-delete.component';
import { ButtonEditComponent } from './ui/button-edit/button-edit.component';
import { ButtonPrimaryComponent } from './ui/button-primary/button-primary.component';
import { ModalWindowComponent } from './ui/modal-window/modal-window.component';
import { PaginationButtonsComponent } from './ui/pagination-buttons/pagination-buttons.component';

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
  ],
  imports: [CommonModule, RouterLink, RouterLinkActive, ReactiveFormsModule],
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
  ],
})
export class SharedModule {}
