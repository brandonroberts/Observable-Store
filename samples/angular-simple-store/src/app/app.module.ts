import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { REDUX_DEVTOOLS_EXTENSION } from './shared/extension';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [    {
    provide: REDUX_DEVTOOLS_EXTENSION,
    useFactory() {
      return (window as any)['__REDUX_DEVTOOLS_EXTENSION__'];
    }
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
