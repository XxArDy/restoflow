import { CommonModule } from '@angular/common';
import { Component, inject, Input, output } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { TableService } from 'src/app/shared/data-access/table/table.service';
import { ITable } from 'src/app/shared/model/table/table';
import { TableFormComponent } from './table-form.component';

@Component({
  selector: 'app-table-edit',
  template: ` <div class="form-container">
    <h1 class="form__title">Edit table</h1>
    <form [formGroup]="tableForms" (ngSubmit)="onSubmit()" class="form">
      <div formArrayName="tables">
        <div
          *ngFor="let tableForm of getTablesControls(); let i = index"
          class="form__array-group"
        >
          <app-table-form [formName]="i" [isEditing]="true"></app-table-form>
        </div>
      </div>

      <div class="form__btn">
        <button type="submit" class="form__submit">Submit</button>
      </div>
    </form>
  </div>`,
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TableFormComponent],
})
export class TableEditComponent {
  @Input() set table(value: ITable) {
    this._table = value;
    if (this._table) {
      this.createForms();
    }
  }

  updateTable = output<void>();

  tableForms: FormGroup;

  private _table!: ITable;

  private _fb = inject(FormBuilder);
  private _tableService = inject(TableService);

  constructor() {
    this.tableForms = this._fb.group({
      tables: this._fb.array([]),
    });
  }

  createForms(): void {
    this.tableForms.setControl(
      'tables',
      this._fb.array([this.createForm(this._table)])
    );
  }

  createForm(table: ITable): FormGroup {
    return this._fb.group({
      id: [table.id],
      name: [table.name],
      statusId: [table.statusId],
      numOfSeats: [table.numOfSeats],
      restaurantId: [table.restaurantId],
    });
  }
  async onSubmit(): Promise<void> {
    if (this.tableForms.valid) {
      let tables = (this.tableForms.get('tables') as FormArray)
        .value as ITable[];
      console.log(tables[0]);
      if (await this._tableService.updateTable(tables[0].id!, tables[0]))
        this.updateTable.emit();
    }
  }

  getTablesControls(): AbstractControl[] {
    const tables = this.tableForms.get('tables');
    return tables instanceof FormArray ? tables.controls : [];
  }
}
