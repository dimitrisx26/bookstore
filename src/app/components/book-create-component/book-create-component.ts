import { CommonModule } from "@angular/common";
import { Component, inject, signal, type WritableSignal } from "@angular/core";
import {
	FormArray,
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { BooksApiService } from "../../services/books-api-service";

@Component({
	selector: "app-book-create-component",
	imports: [CommonModule, FormsModule, ReactiveFormsModule],
	templateUrl: "./book-create-component.html",
	styleUrl: "./book-create-component.css",
})
export class BookCreateComponent {
	/** Books API service instance */
	private apiService: BooksApiService = inject(BooksApiService);

	/** Signal to track submission state */
	isSubmitting: WritableSignal<boolean> = signal(false);

	/** Form group for book creation */
	form: FormGroup = new FormGroup({
		title: new FormControl("", Validators.required),
		subtitle: new FormControl("", Validators.required),
		authors: new FormArray([], Validators.required),
		publisher: new FormControl("", Validators.required),
		pages: new FormControl("", [Validators.required, Validators.min(1)]),
		description: new FormControl("", Validators.required),
		imageUrl: new FormControl("", [
			Validators.required,
			Validators.pattern("https?://.+"),
		]),
		website: new FormControl("", [
			Validators.required,
			Validators.pattern("https?://.+"),
		]),
		categories: new FormArray([], Validators.required),
		averageRating: new FormControl("", [
			Validators.required,
			Validators.min(0),
			Validators.max(5),
		]),
		year: new FormControl("", [
			Validators.required,
			Validators.max(new Date().getFullYear()),
		]),
		isbn10: new FormControl("", [
			Validators.required,
			Validators.pattern("^(?:\\d{9}X|\\d{10})$"),
		]),
		isbn13: new FormControl("", [
			Validators.required,
			Validators.pattern("^(?:\\d{13})$"),
		]),
	});

	/** Handle modal close event */
	onClose(): void {
		this.form.reset();
	}

	/** FormArray getters for template and logic */
	get authorsArray(): FormArray {
		return this.form.get("authors") as FormArray;
	}

	get categoriesArray(): FormArray {
		return this.form.get("categories") as FormArray;
	}

	/** Add/remove helpers for tag-like inputs */
	addAuthor(value: string): void {
		const v = (value ?? "").toString().trim();
		if (!v) return;
		this.authorsArray.push(new FormControl(v));
	}

	removeAuthor(index: number): void {
		if (index >= 0 && index < this.authorsArray.length) {
			this.authorsArray.removeAt(index);
		}
	}

	addCategory(value: string): void {
		const v = (value ?? "").toString().trim();
		if (!v) return;
		this.categoriesArray.push(new FormControl(v));
	}

	removeCategory(index: number): void {
		if (index >= 0 && index < this.categoriesArray.length) {
			this.categoriesArray.removeAt(index);
		}
	}

	/** Handle form submission */
	onSubmit(): void {
		this.isSubmitting.set(true);

		console.log(this.form.value);
		if (!this.form.value) {
			return;
		}
		const raw = this.form.value as Record<string, unknown>;

		const authors = this.authorsArray.controls.map((c) => c.value as string);
		const categories = this.categoriesArray.controls.map(
			(c) => c.value as string,
		);

		const newBook = {
			id: Date.now(),
			...raw,
			authors,
			categories,
		} as unknown as import("../../models/book.model").IBook;
		this.apiService.addBook(newBook);

		this.form.reset();
		this.isSubmitting.set(false);
	}
}
