import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IUserDto } from 'src/app/shared/model/user/user-dto';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  standalone: true,
  imports: [SharedModule],
})
export class OrderComponent implements OnInit {
  currentUser: IUserDto | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.currentUser = this.route.snapshot.data['user'];
  }
}
