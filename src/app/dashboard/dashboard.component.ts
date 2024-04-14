import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, SharedModule],
  template: `<app-side-bar><router-outlet></router-outlet></app-side-bar>`,
})
export class DashboardComponent {}
