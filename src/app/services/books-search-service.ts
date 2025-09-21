import {
  inject,
  Injectable,
  signal,
  WritableSignal,
  Signal,
  effect,
} from '@angular/core';
import { IBook } from '../models/book.model';
import { BooksApiService } from './books-api-service';
import { FilterType } from '../components/book-search-component/book-search-component';

@Injectable({
  providedIn: 'root',
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
    const normalized = (query ?? '').trim().toLowerCase();

    if (!normalized) {
      this.filteredBooks.set(this.books())
      return;
    }

    const filtered = this.books()
      .filter((book) => {
        const title = (book.title ?? '').toLowerCase();
        const isbn10 = (book.isbn10 ?? '').toLowerCase();
        const isbn13 = (book.isbn13 ?? '').toLowerCase();
        const authors = book.authors ?? [];

        const inTitle = title.includes(normalized);
        const inAuthors = authors.some((author) =>
          (author ?? '').toLowerCase().includes(normalized)
        );
        const inIsbn10 = isbn10.includes(normalized);
        const inIsbn13 = isbn13.includes(normalized);

        return inTitle || inAuthors || inIsbn10 || inIsbn13;
      });

    this.filteredBooks.set(filtered);
  }

  /**
   *  Apply a filter to the list of books.
   * 
   * @param type The type of filter
   * @param value The value of the filter
   */
  applyFilter(type: FilterType, value: string): void {
    if (value === 'all') {
      this.filteredBooks.set(this.books());
      return;
    }

    switch (type) {
      case 'category':
        const filteredByCategory = this.books()
          .filter((book) => {
            const categories = book.categories ?? [];
            return categories.includes(value);
          });

        this.filteredBooks.set(filteredByCategory);

        break;

      case 'year':
        const year = parseInt(value, 10);

        const filteredByYear = this.books()
          .filter((book) => {
            const publishedDate = book.year ?? 0;
            const match = publishedDate.toString().match(/\d{4}/);
            if (match) {
              const bookYear = parseInt(match[0], 10);
              return bookYear === year;
            }

            return false;
          });

        this.filteredBooks.set(filteredByYear);

        break;

      case 'publisher':
        const filteredByPublisher = this.books()
          .filter((book) => {
            const publisher = (book.publisher ?? '').toLowerCase();
            return publisher === value.toLowerCase();
          });

        this.filteredBooks.set(filteredByPublisher);

        break;

      case 'rating':        
        const target = Number.parseInt(value, 10);
        if (Number.isNaN(target)) {
          this.filteredBooks.set(this.books());
          return;
        }
        
        this.filteredBooks.set(
          this.books()
            .filter((book) =>
              Math.max(0, Math.min(5, Math.floor(book.averageRating ?? 0))) >= target
            )
        );
 
         break;

      default:

        break;
    }
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
}
