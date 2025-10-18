import { CommonModule } from '@angular/common';
import { Component, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-book-create-component',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './book-create-component.html',
  styleUrl: './book-create-component.css'
})
export class BookCreateComponent {
  isSubmitting: WritableSignal<boolean> = signal(false);
  
  form: FormGroup = new FormGroup({
    title: new FormControl("", Validators.required),
    subtitle: new FormControl("", Validators.required),
    authors: new FormControl("", Validators.required),    
    publisher: new FormControl("", Validators.required),
    pages: new FormControl("", [Validators.required, Validators.min(1)]),
    description: new FormControl("", Validators.required),
    imageUrl: new FormControl("", [Validators.required, Validators.pattern('https?://.+')]),
    website: new FormControl("", [Validators.required, Validators.pattern('https?://.+')]),
    categories: new FormControl("", Validators.required),
    averageRating: new FormControl("", [Validators.required, Validators.min(0), Validators.max(5)]),
    year: new FormControl("", [Validators.required, Validators.max(new Date().getFullYear())]),
    isbn10: new FormControl("", [Validators.required, Validators.pattern('^(?:\\d{9}X|\\d{10})$')]),
    isbn13: new FormControl("", [Validators.required, Validators.pattern('^(?:\\d{13})$')])
  });

  onClose(): void {
    this.form.reset();
  }

  onSubmit(): void {
    this.isSubmitting.set(true);

    console.log(this.form.value);

    this.form.reset();
    this.isSubmitting.set(false)
  }
}
