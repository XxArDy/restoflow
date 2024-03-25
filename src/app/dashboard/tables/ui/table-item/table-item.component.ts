import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { IRestaurantImage } from 'src/app/shared/model/restaurant/restaurant-image';
import { ITable } from 'src/app/shared/model/table/table';
import { TableService } from '../../data-access/table.service';

@Component({
  selector: 'app-table-item',
  templateUrl: './table-item.component.html',
  styleUrls: ['./table-item.component.scss'],
})
export class TableItemComponent implements OnInit {
  @Input() table!: ITable;
  @Output() deleteTableEvent = new EventEmitter<void>();
  @Output() showOrder = new EventEmitter<ITable>();
  tableImage!: IRestaurantImage;

  constructor(private tableService: TableService, private router: Router) {}

  ngOnInit(): void {
    // this.tableService.getTableImage(this.table.id!).subscribe((response) => {
    //   this.tableImage = response;
    // });
  }

  deleteTable(): void {
    // this.tableService.deleteTable(this.table.id).subscribe(() => {
    //   this.deleteTable.emit();
    // });
  }

  onOrderClick(): void {
    this.showOrder.emit(this.table);
  }

  editTable(): void {
    this.router.navigate(['/dashboard', 'tables', 'edit'], {
      queryParams: { table_id: this.table.id },
    });
  }
}
