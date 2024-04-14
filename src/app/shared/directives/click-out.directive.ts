import { Directive, ElementRef, HostListener, output } from '@angular/core';

@Directive({
  selector: '[clickOut]',
})
export class ClickOutDirective {
  clickOut = output();

  constructor(private _elRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: any) {
    if (!this._elRef.nativeElement.contains(event.target)) {
      this.clickOut.emit();
    }
  }
}
