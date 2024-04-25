import { Component } from '@angular/core';

@Component({
  selector: 'button-edit',
  template: `<a class="material-symbols-outlined unselectable"> edit </a>`,
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
          color: $edit;
        }
      }
    }`,
})
export class ButtonEditComponent {}
