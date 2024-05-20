import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent {
  constructor(private translate: TranslateService) {
    this.initializeTranslation();
  }

  private initializeTranslation(): void {
    this.translate.addLangs(['en', 'ua']);

    this.translate.setDefaultLang('ua');

    const browserLang =
      localStorage.getItem('lang') || this.translate.getBrowserLang();

    const langToUse = this.isSupportedLang(browserLang) ? browserLang : 'ua';

    this.translate.use(langToUse || 'ua');
  }

  private isSupportedLang(lang: string | undefined): boolean {
    return lang ? ['en', 'ua'].includes(lang) : false;
  }
}
