import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SideBarComponent } from './side-bar.component';

@NgModule({
  declarations: [SideBarComponent],
  imports: [CommonModule, RouterLink, RouterLinkActive],
  exports: [SideBarComponent],
})
export class SideBarModule {}
