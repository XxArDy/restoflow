import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, map, startWith } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScreenSizeService {
  private isMobileSubject = new BehaviorSubject<boolean>(
    window.innerWidth <= 1023
  );

  isMobile$ = this.isMobileSubject.asObservable();

  constructor() {
    fromEvent(window, 'resize')
      .pipe(
        map((event: any) => event.target.innerWidth <= 1023),
        startWith(window.innerWidth <= 1023)
      )
      .subscribe(this.isMobileSubject);
  }
}
