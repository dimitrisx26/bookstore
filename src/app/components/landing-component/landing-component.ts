import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookCreateComponent } from '../book-create-component/book-create-component';

@Component({
  selector: 'app-landing-component',
  imports: [RouterLink, BookCreateComponent],
  templateUrl: './landing-component.html',
  styleUrl: './landing-component.css',
})
export class LandingComponent {}
