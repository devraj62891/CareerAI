import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';


// this is a decorator - a decorator adds metadata to a class 
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})

//without @component decorator App is just a cladd and angular has no idea what it is but with component decorator abhove it now angular knows that this class is a component(a part of and UI)-----it tells angular that This component should appear wherever <app-root> is found.
export class App {}
