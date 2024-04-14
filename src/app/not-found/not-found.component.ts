import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  template: `
    <div id="notfound">
      <div class="notfound">
        <div class="notfound-404">
          <h1>4<span></span>4</h1>
        </div>
        <h2>Oops! Page Not Be Found</h2>
        <p>
          Sorry but the page you are looking for does not exist, have been
          removed. name changed or is temporarily unavailable
        </p>
        <a [routerLink]="['/']">Back to homepage</a>
      </div>
    </div>
  `,
  styleUrls: ['./not-found.component.scss'],
  imports: [RouterModule],
})
export class NotFoundComponent {}
