import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[autoFocus]',
})
export class AutoFocusDirective implements AfterViewInit {
  @Input() selectAfterFocus: boolean = false;

  constructor(private element: ElementRef) {}

  ngAfterViewInit(): void {
    Promise.resolve().then(() => this._handleAutoFocus());
  }

  private _handleAutoFocus() {
    this.element.nativeElement?.focus();
    this._handleSelection();
  }

  private _handleSelection() {
    if (!this.selectAfterFocus) return;

    if (this.element.nativeElement.select) {
      this.element.nativeElement?.select();
      return;
    }

    if (window.getSelection) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(this.element.nativeElement);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }
}
