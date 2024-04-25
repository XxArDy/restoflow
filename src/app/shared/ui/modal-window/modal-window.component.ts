import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'modal-window',
  template: `
    <div class="modal" *ngIf="isOpen" (click)="close()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <button class="modal-close" (click)="closed.emit()">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <div class="modal-body">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./modal-window.component.scss'],
})
export class ModalWindowComponent {
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();

  close() {
    this.closed.emit();
  }
}
