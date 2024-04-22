import { Component, output } from '@angular/core';

@Component({
  selector: 'pagination-buttons',
  template: `<div class="pagination">
    <i class="material-symbols-outlined unselectable" (click)="leftArrow.emit()"
      >chevron_left</i
    >
    <i
      class="material-symbols-outlined unselectable"
      (click)="rightArrow.emit()"
      >chevron_right</i
    >
  </div>`,
  styles: `
  @import '/src/scss/index';
  .pagination {
    border: $border;
    border-radius: $border-radius;
    @include flex-center;
    height: $button-height;
    box-shadow: $shadow;

    i {
      @include flex-center;
      width: 65px;
      height: $button-height;
      font-size: 30px;
      cursor: pointer;

      @include hover {
        background-color: $light;
      }

      &:first-child {
        border-right: $border;
        border-radius: $border-radius 0 0 $border-radius;
      }

      &:last-child {
        border-radius: 0 $border-radius $border-radius 0;
      }
    }
  }`,
})
export class PaginationButtonsComponent {
  leftArrow = output();
  rightArrow = output();
}
