import { Component } from '@angular/core';

@Component({
  selector: 'button-delete',
  template: `<a class="material-symbols-outlined unselectable"> delete </a>`,
  styles: `
  @import '/src/scss/index';

  :host {
      border: $border;
      border-radius: $border-radius;
      font-size: 24px;
      padding: 10px;
      cursor: pointer;
      @include flex-center;

      a {
        @include hover {
          color: $danger;
        }
      }
    }`,
})
export class ButtonDeleteComponent {}
