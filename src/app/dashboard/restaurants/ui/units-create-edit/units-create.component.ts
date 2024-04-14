import { Component, inject, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UnitsService } from 'src/app/shared/data-access/restaurant/units.service';
import { IUnit } from 'src/app/shared/model/product/unit';

@Component({
  selector: 'app-units-create',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `<div class="form-container">
    <h1 class="form__title">Create unit</h1>
    <form [formGroup]="unitForm" (ngSubmit)="onSubmit()" class="form">
      <div class="form__group">
        <label for="name" class="form__label">Name</label>
        <input
          type="text"
          id="name"
          formControlName="unitName"
          class="form__input"
        />
      </div>
      <div class="form__group">
        <label for="name" class="form__label">Abbreviation</label>
        <input
          type="text"
          id="name"
          formControlName="abbreviation"
          class="form__input"
        />
      </div>
      <div class="form__btn">
        <button type="submit" class="form__submit">Submit</button>
      </div>
    </form>
  </div> `,
})
export class UnitsCreateComponent {
  unitForm = new FormGroup({
    unitName: new FormControl('', Validators.required),
    abbreviation: new FormControl('', Validators.required),
  });

  updateUnits = output<void>();

  private _unitService = inject(UnitsService);

  async onSubmit(): Promise<void> {
    const unit: IUnit = {
      id: 0,
      unitName: this.unitForm.get('unitName')?.value ?? '',
      abbreviation: this.unitForm.get('abbreviation')?.value ?? '',
    };

    if (await this._unitService.createUnit(unit)) this.updateUnits.emit();
  }
}
