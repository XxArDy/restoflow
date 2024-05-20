import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
  message: string;
}

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <div class="mat-dialog-container" mat-dialog-content>
      <h1 mat-dialog-title>{{ 'Form.Confirmation' | translate }}</h1>
      <div class="mat-dialog-content" mat-dialog-content>
        <p>{{ data.message | translate }}</p>
      </div>
      <div class="mat-dialog-actions" mat-dialog-actions>
        <button mat-button cdkFocusInitial (click)="onNoClick()">
          {{ 'Form.No' | translate }}
        </button>
        <button mat-button (click)="onYesClick()">
          {{ 'Form.Yes' | translate }}
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close('cancel');
  }

  onYesClick(): void {
    this.dialogRef.close('confirm');
  }
}
