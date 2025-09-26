import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { map, switchMap } from "rxjs/operators";
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
   */
  getBooks(): Observable<IBook[]> {
    return this.http
      .get<{ books: IBook[] }>("assets/books.json")
      .pipe(map((response) => response.books));
  }

  /**
   * Get a specific book by ID.
   * @param id The book ID to search for
   * @returns Observable of the book or throws error if not found
   */
  getBookById(id: number): Observable<IBook> {
    return this.getBooks().pipe(
      map((books) => books.find((book) => book.id === id)),
      switchMap((book) =>
        book ? [book] : throwError(() => new Error(`Book with ID ${id} not found`))
      )
    );
  }
}
