import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, output } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TableMenuService } from 'src/app/shared/data-access/table/table-menu.service';
import { TableService } from 'src/app/shared/data-access/table/table.service';
import { ITable } from 'src/app/shared/model/table/table';
import { environment } from 'src/environments/environment';
import { TableFormComponent } from './table-form.component';

@Component({
  selector: 'app-table-create',
  template: ` <div class="form-container">
    <h1 class="form__title">{{ 'Tables.Create' | translate }}</h1>
    <form [formGroup]="tableForms" (ngSubmit)="onSubmit()" class="form">
      <div formArrayName="tables">
        <div
          *ngFor="let tableForm of getTablesControls(); let i = index"
          class="form__array-group"
        >
          <app-table-form
            [formName]="i"
            (removeForm)="removeForm($event)"
          ></app-table-form>
        </div>
      </div>
      <div class="form__btn">
        <button class="add-button" type="button" (click)="addForm()">
          {{ 'Form.Add' | translate }}
        </button>
        <button type="submit" class="form__submit">
          {{ 'Form.Submit' | translate }}
        </button>
      </div>
    </form>
  </div>`,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    TableFormComponent,
    TranslateModule,
  ],
})
export class TableCreateComponent implements OnInit {
  updateTable = output<void>();

  tableForms!: FormGroup;

  private _fb = inject(FormBuilder);
  private _tableService = inject(TableService);
  private _tableMenuService = inject(TableMenuService);

  private _tableForEdit: ITable = {
    name: '',
    numOfSeats: 0,
    statusId: environment.statusCode[0],
    restaurantId: 0,
  };

  ngOnInit(): void {
    this._tableForEdit.restaurantId =
      this._tableMenuService.selectedRestaurantId;
    this.createForms();
  }

  createForms(): void {
    this.tableForms = this._fb.group({
      tables: this._fb.array([this.createForm(this._tableForEdit)]),
    });
  }

  createForm(table: ITable): FormGroup {
    return this._fb.group({
      name: [table.name],
      statusId: [table.statusId],
      numOfSeats: [table.numOfSeats],
      restaurantId: [table.restaurantId],
    });
  }

  addForm(): void {
    const tables = this.tableForms.get('tables') as FormArray;
    tables.push(
      this.createForm({
        name: '',
        numOfSeats: 0,
        statusId: environment.statusCode[0],
        restaurantId: this._tableMenuService.selectedRestaurantId,
      })
    );
  }

  removeForm(index: number): void {
    const tables = this.tableForms.get('tables') as FormArray;
    tables.removeAt(index);
  }

  async onSubmit(): Promise<void> {
    if (this.tableForms.valid) {
      let tables = (this.tableForms.get('tables') as FormArray)
        .value as ITable[];
      if (await this._tableService.createTable(tables)) this.updateTable.emit();
    }
  }

  getTablesControls(): AbstractControl[] {
    const tables = this.tableForms.get('tables');
    return tables instanceof FormArray ? tables.controls : [];
  }
}
