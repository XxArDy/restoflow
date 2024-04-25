import {
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ControlContainer, FormControl, FormGroup } from '@angular/forms';
import {
  IgxButtonModule,
  IgxIconModule,
  IgxInputGroupModule,
  IgxTimePickerComponent,
  IgxTimePickerModule,
  IgxToastComponent,
  IgxToastModule,
} from 'igniteui-angular';
import { map, Observable } from 'rxjs';
import { ROLES_CONFIG } from 'src/app/shared/configs/app-role';
import { getCurrentDateInKiev } from 'src/app/shared/data-access/helpers/func';
import { TableService } from 'src/app/shared/data-access/table/table.service';
import { UserService } from 'src/app/shared/data-access/user/user.service';
import { ITable } from 'src/app/shared/model/table/table';
import { ITableReservation } from 'src/app/shared/model/table/table-reservation';
import { IUserDto } from 'src/app/shared/model/user/user-dto';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-table-reservation-form',
  standalone: true,
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  imports: [
    SharedModule,
    IgxTimePickerModule,
    IgxInputGroupModule,
    IgxIconModule,
    IgxToastModule,
    IgxButtonModule,
  ],
  template: `<div class="form__group-line">
      <div class="form__group">
        <label for="table-id" class="form__label">Table</label>
        <select id="table-id" formControlName="tableId" class="form__select">
          <option value="" disabled selected>Select the table</option>
          <option
            *ngFor="let table of tableList$ | async"
            [value]="table.id"
            [selected]="table.id === selectedTableId()"
          >
            {{ table.name }}
          </option>
        </select>
      </div>
      <div class="form__group">
        <label for="user-id" class="form__label">User</label>
        <select id="user-id" formControlName="userId" class="form__select">
          <option disabled selected [value]="0">Select the user</option>
          <option *ngFor="let user of userList$ | async" [value]="user.id">
            {{ userService.getFullName(user) }}
          </option>
        </select>
      </div>
    </div>
    <div class="form__group-line">
      <div class="form__group">
        <label for="reservationDate" class="form__label">Date</label>
        <input
          matInput
          class="form__input"
          id="reservationDate"
          [matDatepicker]="datePicker"
          [min]="minDate"
          formControlName="reservationDate"
        />
        <mat-datepicker-toggle
          matSuffix
          [for]="datePicker"
        ></mat-datepicker-toggle>
        <mat-datepicker #datePicker></mat-datepicker>
      </div>
      <div class="form__group">
        <label for="reservationTime" class="form__label">Time</label>
        <igx-time-picker
          #picker
          id="reservationTime"
          formControlName="reservationTime"
          [inputFormat]="'H:mm'"
          [itemsDelta]="{ hours: 1, minutes: 30 }"
          [minValue]="minTime"
          [maxValue]="maxTime"
          (validationFailed)="onValidationFailed()"
        >
          >
          <igx-picker-toggle igxPrefix>
            <igx-icon (click)="picker.toggle()">access_alarm</igx-icon>
          </igx-picker-toggle>
          <ng-template igxTimePickerActions>
            <div class="action-buttons">
              <button
                type="button"
                igxButton="flat"
                (click)="picker.cancelButtonClick()"
              >
                cancel
              </button>
              <button
                type="button"
                igxButton="flat"
                (click)="picker.okButtonClick()"
              >
                done
              </button>
              <button
                type="button"
                igxButton="flat"
                (click)="selectNow(picker)"
              >
                now
              </button>
            </div>
          </ng-template>
        </igx-time-picker>
        <igx-toast #toast
          >Value must be between {{ minTime }} and {{ maxTime }}.</igx-toast
        >
      </div>
    </div>`,
})
export class TableReservationFormComponent implements OnInit, OnDestroy {
  @ViewChild('toast', { static: true })
  private _toast!: IgxToastComponent;

  @Input() set reservationValue(value: ITableReservation | undefined) {
    if (value?.reservationDate instanceof String) {
      value.reservationDate = new Date(value.reservationDate);
    }
    if (value?.reservationTime instanceof String) {
      value.reservationTime = value.reservationTime + ':00';
    }
    console.log(value);
    this.reservation = value;
    if (value) this._updateReservation();
  }

  reservation: ITableReservation | undefined = {
    id: 0,
    createdDate: '',
    reservationDate: getCurrentDateInKiev(),
    reservationTime: { hours: 0, minutes: 0 },
    tableId: '',
    userId: 0,
  };

  selectedTableId = input<string>('');
  @Input() set restaurantId(value: number) {
    this.tableList$ = this._tableService
      .getAllTablesByRestaurantId(value)
      .pipe(map((res) => res.content));
  }

  userList$: Observable<IUserDto[]> | null = null;
  tableList$: Observable<ITable[]> | null = null;
  minDate = getCurrentDateInKiev();

  minTime = '01:00:00';
  maxTime = '23:30:00';

  parentContainer = inject(ControlContainer);
  userService = inject(UserService);
  private _tableService = inject(TableService);

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.userList$ = this.userService
      .getAllUsers()
      .pipe(
        map((res) =>
          res.filter((user) => user.authorities?.includes(ROLES_CONFIG.user))
        )
      );

    this.parentFormGroup.addControl(
      'id',
      new FormControl(this.reservation?.id)
    );
    this.parentFormGroup.addControl(
      'createdDate',
      new FormControl(this.reservation?.createdDate)
    );
    this.parentFormGroup.addControl(
      'reservationDate',
      new FormControl(this.reservation?.reservationDate)
    );
    this.parentFormGroup.addControl(
      'reservationTime',
      new FormControl(this.reservation?.reservationTime)
    );
    this.parentFormGroup.addControl(
      'tableId',
      new FormControl(this.reservation?.tableId)
    );
    this.parentFormGroup.addControl(
      'userId',
      new FormControl(this.reservation?.userId)
    );
  }

  ngOnDestroy(): void {
    this.parentFormGroup.removeControl('id');
    this.parentFormGroup.removeControl('createdDate');
    this.parentFormGroup.removeControl('reservationDate');
    this.parentFormGroup.removeControl('reservationTime');
    this.parentFormGroup.removeControl('tableId');
    this.parentFormGroup.removeControl('userId');
  }

  public selectNow(timePicker: IgxTimePickerComponent) {
    const date = new Date();
    const minutes = date.getMinutes();
    const hours = date.getHours();

    const roundedMinutes = minutes >= 30 ? 60 : 30;
    const roundedHours = roundedMinutes === 60 ? hours + 1 : hours;

    date.setHours(roundedHours);
    date.setMinutes(roundedMinutes % 60);
    date.setSeconds(0);

    timePicker.value = date;
    timePicker.close();
  }

  public onValidationFailed() {
    this._toast.open();
  }

  private _updateReservation() {
    this.parentFormGroup.get('id')?.setValue(this.reservation?.id);
    this.parentFormGroup
      .get('createdDate')
      ?.setValue(this.reservation?.createdDate);
    this.parentFormGroup
      .get('reservationDate')
      ?.setValue(this.reservation?.reservationDate);
    this.parentFormGroup
      .get('reservationTime')
      ?.setValue(this.reservation?.reservationTime);
    this.parentFormGroup.get('tableId')?.setValue(this.reservation?.tableId);
    this.parentFormGroup.get('userId')?.setValue(this.reservation?.userId);
  }
}
