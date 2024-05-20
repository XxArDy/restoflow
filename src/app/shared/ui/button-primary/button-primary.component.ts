import { Component, input } from '@angular/core';

@Component({
  selector: 'button-primary',
  template: `<span class="unselectable">{{ name() | translate }}</span>`,
  styles: `
  @import '/src/scss/index';

  :host {
    @include flex-center;
    width: 250px;
    font-size: 18px;
    height: $button-height;
    color: $text-dark;
    background-color: $primary;
    border: $border;
    border-radius: $border-radius;
    cursor: pointer;
    box-shadow: $shadow;

    &:not(.disabled):not([disabled]) {
      @include hover {
        opacity: $opacity;
      }
    }
  }`,
})
export class ButtonPrimaryComponent {
  name = input.required<string>();
}
