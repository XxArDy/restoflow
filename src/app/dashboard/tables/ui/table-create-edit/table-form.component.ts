import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { ControlContainer, ReactiveFormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-table-form',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  template: `<fieldset
    [class]="!isEditing() ? 'form__array-fieldset' : ''"
    [formGroupName]="formName()"
  >
    <div class="form__group">
      <label for="name" class="form__label">Name</label>
      <input type="text" id="name" formControlName="name" class="form__input" />
    </div>
    <div class="form__group">
      <label for="numOfSeats" class="form__label">Seats count</label>
      <input
        type="number"
        id="numOfSeats"
        formControlName="numOfSeats"
        class="form__input"
      />
    </div>
    <div class="form__group">
      <label for="statusId" class="form__label">Status</label>
      <select id="statusId" formControlName="statusId" class="form__select">
        <option *ngFor="let status of allStatuses" [value]="status">
          {{ status }}
        </option>
      </select>
    </div>
    <button
      class="remove-button"
      *ngIf="!isEditing()"
      type="button"
      (click)="removeForm.emit(formName()!); $event.stopPropagation()"
    >
      Remove
    </button>
  </fieldset>`,
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class TableFormComponent {
  isEditing = input<boolean>(false);
  formName = input.required<number>();

  removeForm = output<number>();

  get allStatuses() {
    return environment.statusCode;
  }
}
