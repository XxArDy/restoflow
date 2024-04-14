import {
  Component,
  inject,
  input,
  OnChanges,
  output,
  SimpleChanges,
} from '@angular/core';
import { Observable } from 'rxjs';
import { FilterService } from 'src/app/shared/data-access/helpers/filter.service';
import { UnitsService } from 'src/app/shared/data-access/restaurant/units.service';
import { IUnit } from 'src/app/shared/model/product/unit';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-units-list',
  template: `<div class="unit-list__header">
      <button-primary
        name="Create unit"
        (click)="createUnit.emit()"
      ></button-primary>
      <pagination-buttons
        (leftArrow)="filterService.changePage(-1, units())"
        (rightArrow)="filterService.changePage(1, units())"
      ></pagination-buttons>
    </div>
    <div class="unit-list__body">
      <div *ngFor="let unit of filteredList | async" class="unit-list__item">
        <div class="unit-list__item-name">
          {{ unit.unitName }}
        </div>
        <div class="unit-list__item-abbreviation">
          {{ unit.abbreviation }}
        </div>
        <div class="unit-list__item-buttons">
          <button-edit (click)="this.editUnit.emit(unit.id)"></button-edit>
          <button-delete (click)="onDeleteUnit(unit.id)"></button-delete>
        </div>
      </div>
    </div>`,
  styleUrls: ['./units-list.component.scss'],
  standalone: true,
  imports: [SharedModule],
  providers: [FilterService],
})
export class UnitsListComponent implements OnChanges {
  units = input.required<Observable<IUnit[]> | null>();

  updateUnits = output<void>();
  editUnit = output<number>();
  createUnit = output<void>();

  filteredList: Observable<IUnit[]> | null = null;

  filterService = inject(FilterService);
  private _unitService = inject(UnitsService);

  ngOnChanges(changes: SimpleChanges): void {
    if (this.units() !== null) {
      this.filteredList = this.filterService.filter(this.units()!);
    }
  }

  async onDeleteUnit(id: number): Promise<void> {
    if (await this._unitService.deleteUnit(id)) this.updateUnits.emit();
  }
}
