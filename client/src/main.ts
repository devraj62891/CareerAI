import { bootstrapApplication } from '@angular/platform-browser';//this fucntion provided by angular tells which component to be loaded first

import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
