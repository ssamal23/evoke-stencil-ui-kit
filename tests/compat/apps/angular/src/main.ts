import { bootstrapApplication } from '@angular/platform-browser';
import { defineCustomElements } from '@evoke-tech/stencil-ui-kit/loader';
import { AppComponent } from './app/app.component';

defineCustomElements();
bootstrapApplication(AppComponent).catch((err) => console.error(err));
