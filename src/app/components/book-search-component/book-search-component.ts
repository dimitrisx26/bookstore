import { Component, inject, Signal } from "@angular/core";
import { IBook } from "../../models/book.model";
import { BooksSearchService } from "../../services/books-search-service";

@Component({
  selector: "app-book-search-component",
  imports: [],
  templateUrl: "./book-search-component.html",
  styleUrl: "./book-search-component.css",
})
export class BookSearchComponent {
  /**
   * Search service instance.
   */
  private search: BooksSearchService = inject(BooksSearchService);

  /**
   * Signal of the list of books returned from the search service.
   */
  readonly books: Signal<IBook[]> = this.search.getBooksSignal();

  /**
   * Loading state signal from the service.
   */
  readonly loading: Signal<boolean> = this.search.getLoadingSignal();
}
