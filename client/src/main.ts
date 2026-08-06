//this page is the entry point of the application--just like java ave public static void main() as the entry point

import { bootstrapApplication } from '@angular/platform-browser';//this fucntion provided by angular package tells which component to be loaded first

// Angular Library
//     ├── Router
//     ├── HttpClient
//     ├── Forms
//     └── Platform Browser

import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig) //bootstarp means start the angular application
  .catch((err) => console.error(err));
