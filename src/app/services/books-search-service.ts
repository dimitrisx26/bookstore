import {
  inject,
  Injectable,
  signal,
  WritableSignal,
  Signal,
  effect,
} from "@angular/core";
import { IBook } from "../models/book.model";
import { BooksApiService } from "./books-api-service";

@Injectable({
  providedIn: "root",
})
export class BooksSearchService {
  // Internal writable signals
  private books: WritableSignal<IBook[]> = signal<IBook[]>([]);
  private isLoading: WritableSignal<boolean> = signal(false);
  private error: WritableSignal<Error | null> = signal<Error | null>(null);

  // Internal trigger: incrementing this causes the effect to re-run and fetch books
  private refreshTrigger = signal(0);

  // API client (use inject() per Angular guidance)
  private api = inject(BooksApiService);

  constructor() {
    // Effect watches the `refreshTrigger()` and runs initially and whenever
    // `reload()` increments it. It performs the HTTP request and updates the
    // `books`, `isLoading`, and `error` signals. onCleanup unsubscribes.
    effect(
      (onCleanup) => {
        // make the effect depend on the trigger
        this.refreshTrigger();

        // begin load
        this.isLoading.set(true);
        this.error.set(null);

        const sub = this.api.getBooks().subscribe({
          next: (books: IBook[]) => {
            this.books.set(books);
            this.error.set(null);
          },
          error: (err: unknown) => {
            this.error.set(err instanceof Error ? err : new Error(String(err)));
            // set loading false on error
            this.isLoading.set(false);
          },
          complete: () => {
            // mark loading finished when observable completes
            this.isLoading.set(false);
          },
        });

        onCleanup(() => sub.unsubscribe());
      },
      { allowSignalWrites: true },
    );
  }

  // Public API ---------------------------------------------------------------

  /**
   * Increment internal trigger to reload books. Safe to call multiple times.
   */
  reload(): void {
    this.refreshTrigger.update((n) => n + 1);
  }

  /**
   * Optimistically add a book to the local list. If you persist the book to the
   * server, call `reload()` after the server confirms the change (or call
   * `createBook()` below which handles the server call and triggers a reload).
   */
  addLocalBook(book: IBook): void {
    this.books.update((curr) => [book, ...curr]);
  }

  /**
   * Create a book on the server.
   *
   * - `book` should be the payload to send to the server (omit `id` if server assigns it).
   * - `optimistic` when true adds a temporary local entry immediately; on server
   *    confirmation we trigger a `reload()` to get the authoritative list.
   *
   * Note: This method manages the server call and side-effects; it does not
   * return the Observable. If you need the Observable, call `BooksApiService`
   * directly.
   */
  createBook(book: Omit<IBook, "id">, optimistic = true): void {
    if (optimistic) {
      // create a temporary local book for immediate UI feedback
      const temp: IBook = { ...book, id: Date.now() };
      this.addLocalBook(temp);
    }

    this.api.createBook(book).subscribe({
      next: (created: IBook) => {
        // After server confirms, prefer authoritative data: reload list
        this.reload();
      },
      error: (err: unknown) => {
        this.error.set(err instanceof Error ? err : new Error(String(err)));
        // Consider reverting optimistic update in a more advanced implementation
      },
    });
  }

  // Readonly signal accessors for components/templates -----------------------

  getBooksSignal(): Signal<IBook[]> {
    return this.books.asReadonly() as Signal<IBook[]>;
  }

  getLoadingSignal(): Signal<boolean> {
    return this.isLoading.asReadonly() as Signal<boolean>;
  }

  getErrorSignal(): Signal<Error | null> {
    return this.error.asReadonly() as Signal<Error | null>;
  }
}
