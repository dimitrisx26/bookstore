/**
 * Book model interface
 */

export interface IBook {
  /**
   * Unique identifier for the book.
   */
  id: number;

  /**
   * Title of the book.
   */
  title: string;

  /**
   * Optional subtitle.
   */
  subtitle?: string;

  /**
   * One or more authors.
   */
  authors: string[];

  /**
   * Publisher name.
   */
  publisher: string;

  /**
   * Number of pages.
   */
  pages: number;

  /**
   * Short/long description or summary.
   */
  description: string;

  /**
   * URL to a thumbnail or cover image.
   */
  imageUrl: string;

  /**
   * Website URL.
   */
  website: string;

  /**
   * Categories or genres assigned to the book.
   */
  categories: string[];

  /**
   * Average user rating (e.g. 0.0 - 5.0).
   */
  averageRating: number;

  /**
   * Year of publication.
   */
  year: number;

  /**
   * Common identifiers.
   */
  isbn10?: string;
  isbn13?: string;
}
