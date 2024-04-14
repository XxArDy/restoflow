import {
  Component,
  inject,
  input,
  OnChanges,
  output,
  SimpleChanges,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UnitsService } from 'src/app/shared/data-access/restaurant/units.service';
import { IUnit } from 'src/app/shared/model/product/unit';

@Component({
  selector: 'app-units-edit',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `<div class="form-container">
    <h1 class="form__title">Edit unit</h1>
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
export class UnitsEditComponent implements OnChanges {
  unitForm = new FormGroup({
    unitName: new FormControl('', Validators.required),
    abbreviation: new FormControl('', Validators.required),
  });

  unit = input.required<IUnit>();
  updateUnits = output<void>();

  private _unitService = inject(UnitsService);

  ngOnChanges(changes: SimpleChanges): void {
    this.unitForm.patchValue({
      unitName: this.unit()?.unitName,
      abbreviation: this.unit()?.abbreviation,
    });
  }

  async onSubmit(): Promise<void> {
    const unit: IUnit = {
      id: this.unit().id,
      unitName: this.unitForm.get('unitName')?.value ?? '',
      abbreviation: this.unitForm.get('abbreviation')?.value ?? '',
    };

    if (await this._unitService.updateUnit(unit)) this.updateUnits.emit();
  }
}
