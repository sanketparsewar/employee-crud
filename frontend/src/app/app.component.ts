import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit  {
  title = 'frontend';
  isDarkMode = false;
  constructor() {
  }

  ngOnInit(): void {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    this.isDarkMode = localStorage.getItem("theme") 
      ? localStorage.getItem("theme") === "dark"
      : prefersDark;

    document.documentElement.classList.toggle("dark", this.isDarkMode);
  }
   
}
