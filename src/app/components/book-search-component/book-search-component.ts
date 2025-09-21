import { Component, inject, Signal } from "@angular/core";
import { IBook } from "../../models/book.model";
import { BooksSearchService } from "../../services/books-search-service";

export type FilterType = 'category' | 'year' | 'publisher' | 'rating';

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
  readonly books: Signal<IBook[]> = this.search.getFilteredBooksSignal();

  /**
   * Loading state signal from the service.
   */
  readonly loading: Signal<boolean> = this.search.getLoadingSignal();

  /**
   * Select filters options signals.
   */
  readonly categories: Signal<string[]> = this.search.getCategoriesSignal();
  readonly years: Signal<number[]> = this.search.getYearsSignal()
  readonly publishers: Signal<string[]> = this.search.getPublishersSignal()


  /**
   * Filter change handler.
   * @param type The type of filter (e.g., 'category', 'year', 'publisher', 'rating').
   * @param value The value of the filter.
   */
  onFilterChange(type: FilterType, event: any): void {
    this.search.applyFilter(type, event.target.value);
  }

  /**
   * Search books based on the query.
   */
  onSearch(query: string): void {    
    this.search.searchBooks(query);
  }
}
