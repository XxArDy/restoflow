import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-not-found',
  standalone: true,
  template: `
    <div id="notfound">
      <div class="notfound">
        <div class="notfound-404">
          <h1>4<span></span>4</h1>
        </div>
        <h2>{{ 'NotFound.Title' | translate }}</h2>
        <p>{{ 'NotFound.Message' | translate }}</p>
        <a [routerLink]="['/']">{{ 'NotFound.Back' | translate }}</a>
      </div>
    </div>
  `,
  styleUrls: ['./not-found.component.scss'],
  imports: [RouterModule, TranslateModule],
})
export class NotFoundComponent {}
