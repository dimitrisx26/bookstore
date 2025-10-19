import {
	effect,
	Injectable,
	inject,
	type Signal,
	signal,
	type WritableSignal,
} from "@angular/core";
import type { FilterType } from "../components/book-search-component/book-search-component";
import type { IBook } from "../models/book.model";
import { BooksApiService } from "./books-api-service";

@Injectable({
	providedIn: "root",
})
export class BooksSearchService {
	/**
	 * Manages searching and caching books from the API.
	 */
	private books: WritableSignal<IBook[]> = signal<IBook[]>([]);

	/**
	 * Holds the filtered books based on the search query.
	 */
	private filteredBooks: WritableSignal<IBook[]> = signal<IBook[]>([]);

	/**
	 * Loading state signal.
	 */
	private isLoading: WritableSignal<boolean> = signal(false);

	/**
	 * Error state signal (null if no error).
	 */
	private error: WritableSignal<Error | null> = signal<Error | null>(null);

	/**
	 * Indicates if there is an active filter.
	 */
	private hasFilter: WritableSignal<boolean> = signal(false);

	/**
	 * Dynamic filter option lists.
	 */
	private categories: WritableSignal<string[]> = signal<string[]>([]);
	private years: WritableSignal<number[]> = signal<number[]>([]);
	private publishers: WritableSignal<string[]> = signal<string[]>([]);

	/**
	 * Current active filter type and value.
	 */
	private activeFilters: WritableSignal<Map<FilterType, string>> = signal(
		new Map<FilterType, string>(),
	);

	/**
	 * Indicates if there is an active search query.
	 */
	private hasQuery: WritableSignal<boolean> = signal(false);

	/**
	 * Last search query string.
	 */
	private lastQuery: WritableSignal<string> = signal("");

	/**
	 * Effect that rebuilds filteredBooks whenever books, the last query or the active filter change.
	 */
	
  // biome-ignore lint/correctness/noUnusedPrivateClassMembers: <It gets triggered by signal changes>
  private  rebuildFilteredBooksEffect = effect(() => {
		// signals to make the effect track updates
		const allBooks = this.books();
		const queryActive = this.hasQuery();
		const query = this.lastQuery();
		const filterActive = this.hasFilter();
		const filters = this.activeFilters();

		let result = allBooks;

		// Apply query if active.
		if (queryActive && query) {
			result = result.filter((book) => this.bookMatchesQuery(book, query));
		}

		// Apply all active filters.
		if (filterActive && filters && filters.size > 0) {
			result = this.applyFiltersToBooks(result, filters);
		}

		this.filteredBooks.set(result);
	});

	/**
	 * Effect to compute dynamic filter option lists whenever the loaded books change.
	 */
  // biome-ignore lint/correctness/noUnusedPrivateClassMembers: <It gets triggered by signal changes>
	private computeFilterOptionsEffect = effect(() => {
		const allBooks = this.books();

		const booksCategories = new Set<string>();
		const booksYears = new Set<number>();
		const booksPublishers = new Set<string>();

		allBooks.forEach((book) => {
			(book.categories ?? []).forEach((c) => {
				if (c) booksCategories.add(c);
			});

			const yearPublished = Number(book.year ?? 0);

			if (!Number.isNaN(yearPublished) && yearPublished > 0) {
				booksYears.add(yearPublished);
			}

			const publisher = (book.publisher ?? "").trim();
			if (publisher) {
				booksPublishers.add(publisher);
			}
		});

		this.categories.set(
			Array.from(booksCategories).sort((a, b) => a.localeCompare(b)),
		);
		this.years.set(Array.from(booksYears).sort((a, b) => a - b));
		this.publishers.set(
			Array.from(booksPublishers).sort((a, b) => a.localeCompare(b)),
		);
	});

	/**
	 * Returns true if the book matches the normalized query string.
	 */
	private bookMatchesQuery(book: IBook, normalized: string): boolean {
		const title = (book.title ?? "").toLowerCase();
		const isbn10 = (book.isbn10 ?? "").toLowerCase();
		const isbn13 = (book.isbn13 ?? "").toLowerCase();
		const authors = book.authors ?? [];

		const inTitle = title.includes(normalized);
		const inAuthors = authors.some((author) =>
			(author ?? "").toLowerCase().includes(normalized),
		);
		const inIsbn10 = isbn10.includes(normalized);
		const inIsbn13 = isbn13.includes(normalized);

		return inTitle || inAuthors || inIsbn10 || inIsbn13;
	}

	/**
	 * Apply all filters from the map to the provided book array and return the filtered array.
	 */
	private applyFiltersToBooks(
		books: IBook[],
		filters: Map<FilterType, string>,
	): IBook[] {
		let result = books;

		filters.forEach((filterValue, filterType) => {
			result = result.filter((book) =>
				this.applySingleFilter(book, filterType, filterValue),
			);
		});

		return result;
	}

	/**
	 * Apply a single filter to a book and return true if the book passes the filter.
	 */
	private applySingleFilter(
		book: IBook,
		filterType: FilterType,
		filterValue: string,
	): boolean {
		switch (filterType) {
			case "category": {
				const categories = book.categories ?? [];
				return categories.includes(filterValue);
			}

			case "year": {
				const year = parseInt(filterValue, 10);
				const yearPublished = Number(book.year ?? 0);

				return !Number.isNaN(year) && yearPublished === year;
			}

			case "publisher": {
				const publisher = (book.publisher ?? "").toLowerCase();
				return publisher === filterValue.toLowerCase();
			}

			case "rating": {
				const target = Number.parseInt(filterValue, 10);

				if (Number.isNaN(target)) {
					return true;
				}

				return (
					Math.max(0, Math.min(5, Math.floor(book.averageRating ?? 0))) >=
					target
				);
			}

			default:
				return true;
		}
	}

	/**
	 * Books API service instance.
	 */
	private api = inject(BooksApiService);

	constructor() {
		this.loadBooks();
	}

	/**
	 * Load books from the API and update signals accordingly.
	 */
	private loadBooks(): void {
		this.isLoading.set(true);
		this.error.set(null);

		this.api.getBooks().subscribe({
			next: (books: IBook[]) => {
				this.books.set(books);
				this.filteredBooks.set(books);

				this.isLoading.set(false);
			},
			error: (err: Error) => {
				this.error.set(err);
				this.isLoading.set(false);
			},
		});
	}

	/**
	 * Search books based on the query.
	 */
	searchBooks(query: string): void {
		const normalized = (query ?? "").trim().toLowerCase();

		this.hasQuery.set(normalized.length > 0);
		this.lastQuery.set(normalized);
	}

	/**
	 *  Apply a filter to the list of books.
	 *
	 * @param type The type of filter
	 * @param value The value of the filter
	 */
	applyFilter(type: FilterType, value: string): void {
		const current = new Map(this.activeFilters());

		if (value === "all") {
			current.delete(type);
		} else {
			current.set(type, value);
		}

		this.activeFilters.set(current);
		this.hasFilter.set(current.size > 0);
	}

	/**
	 * Remove a specific filter type.
	 */
	removeFilter(type: FilterType): void {
		const current = new Map(this.activeFilters());
		if (current.delete(type)) {
			this.activeFilters.set(current);
			this.hasFilter.set(current.size > 0);
		}
	}

	/**
	 * Clear all active filters.
	 */
	clearFilters(): void {
		this.activeFilters.set(new Map<FilterType, string>());
		this.hasFilter.set(false);
	}

	/**
	 * Get read-only signal of the filtered list of books.
	 */
	getFilteredBooksSignal(): Signal<IBook[]> {
		return this.filteredBooks.asReadonly() as Signal<IBook[]>;
	}

	/**
	 * Get read-only signal of the loading state.
	 */
	getLoadingSignal(): Signal<boolean> {
		return this.isLoading.asReadonly() as Signal<boolean>;
	}

	/**
	 * Get read-only signal of the current error state (or null if no error).
	 */
	getErrorSignal(): Signal<Error | null> {
		return this.error.asReadonly() as Signal<Error | null>;
	}

	/**
	 * Read-only signals exposing available filter options.
	 */
	getCategoriesSignal(): Signal<string[]> {
		return this.categories.asReadonly() as Signal<string[]>;
	}

	getYearsSignal(): Signal<number[]> {
		return this.years.asReadonly() as Signal<number[]>;
	}

	getPublishersSignal(): Signal<string[]> {
		return this.publishers.asReadonly() as Signal<string[]>;
	}
}
