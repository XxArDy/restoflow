import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDisable]',
})
export class DisableDirective {
  @Input('appDisable') set ifDisabled(isDisabled: boolean) {
    if (isDisabled) {
      this.renderer.addClass(this.el.nativeElement, 'disabled');
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'disabled');
    }
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {}
}
