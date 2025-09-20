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
   */
  getBooks(): Observable<IBook[]> {
    return this.http
      .get<{ books: IBook[] }>("assets/books.json")
      .pipe(map((response) => response.books));
  }
}
