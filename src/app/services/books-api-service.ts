import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { IBook } from "../models/book.model";

@Injectable({
  providedIn: "root",
})
export class BooksApiService {
  /**
   * HttpClient instance for making HTTP requests.
   */
  private http = inject(HttpClient);

  /**
   * Fetch books from /assets/books.json and return the inner `books` array.
   *
   * Note: This implementation reads a static JSON file placed under `assets`.
   * For a real backend, replace the URL with your API endpoint.
   */
  getBooks(): Observable<IBook[]> {
    return this.http
      .get<{ books: IBook[] }>("assets/books.json")
      .pipe(map((response) => response.books));
  }

  /**
   * Create a new book on the server.
   *
   * This method posts the supplied book data to the backend and returns the
   * created `IBook` object (typically including an `id` assigned by the server).
   *
   * Usage:
   * - Call this from a higher-level service (e.g. BooksSearchService) to persist
   *   a new book, then trigger a reload of the books list (or update the local
   *   signal optimistically).
   *
   * Note: The URL here is an example (`/api/books`). Replace it with your real
   * backend endpoint. If you're using a static `assets` file in development,
   * POST won't work there and you'll need a real API or a mock server.
   */
  createBook(book: Omit<IBook, "id">): Observable<IBook> {
    return this.http.post<IBook>("/api/books", book);
  }
}
