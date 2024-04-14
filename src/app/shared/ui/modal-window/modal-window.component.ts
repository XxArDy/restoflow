import { Component, input, output } from '@angular/core';

@Component({
  selector: 'modal-window',
  template: ` <div class="modal" *ngIf="isOpen()">
    <div class="modal-content" (clickOut)="close()">
      <div class="modal-header">
        <button class="modal-close" (click)="closed.emit()">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      <div class="modal-body">
        <ng-content></ng-content>
      </div>
    </div>
  </div>`,
  styleUrls: ['./modal-window.component.scss'],
})
export class ModalWindowComponent {
  isOpen = input(false);
  closed = output();

  private _canClose = false;

  close() {
    if (this._canClose) this.closed.emit();
    this._canClose = !this._canClose;
  }
}
