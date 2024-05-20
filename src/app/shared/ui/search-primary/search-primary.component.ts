import { Component, input } from '@angular/core';
import { FilterService } from '../../data-access/helpers/filter.service';

@Component({
  selector: 'search-primary',
  template: ` <div class="search" clickToFocus="searchInput">
    <i class="material-symbols-outlined unselectable">search</i>
    <input
      #searchInput
      id="searchInput"
      type="text"
      [placeholder]="'Filter.Search' | translate"
      (input)="updateQuery(searchInput.value)"
    />
  </div>`,
  styles: `
  @import '/src/scss/index';
  .search {
    width: 250px;
    height: $input-height;
    display: flex;
    align-items: center;
    border: $border;
    border-radius: $border-radius;
    cursor: text;

    i {
      margin: 10px;
      font-size: 30px;
    }

    input {
      @include reset-button;
      width: 100%;
      height: 100%;
      font-size: 18px;

      &:focus {
        outline: none;
      }
    }
  }`,
})
export class SearchPrimaryComponent {
  filterService = input.required<FilterService>();

  updateQuery(query: string): void {
    this.filterService().setQuery(query);
  }
}
