import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[clickToFocus]',
})
export class ClickToFocusDirective {
  @Input('clickToFocus') focusId!: string;

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  @HostListener('click')
  onClick() {
    const targetElement = this.renderer.selectRootElement(`#${this.focusId}`);
    if (targetElement) {
      targetElement.focus();
    }
  }
}
