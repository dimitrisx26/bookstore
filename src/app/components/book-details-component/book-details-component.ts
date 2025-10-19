import { CommonModule, ViewportScroller } from "@angular/common";
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	type OnInit,
	signal,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import type { IBook } from "../../models/book.model";
import { BooksApiService } from "../../services/books-api-service";

@Component({
	selector: "app-book-details-component",
	imports: [CommonModule],
	templateUrl: "./book-details-component.html",
	styleUrl: "./book-details-component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookDetailsComponent implements OnInit {
	/**
	 * Injected services
	 */
	private route = inject(ActivatedRoute);
	private router = inject(Router);
	private viewport = inject(ViewportScroller);
	private booksApi = inject(BooksApiService);

	/**
	 * Component state signals
	 */
	readonly book = signal<IBook | null>(null);
	readonly loading = signal<boolean>(false);
	readonly error = signal<string | null>(null);
	readonly imageError = signal<boolean>(false);
	readonly imageWidth = signal<number | null>(null);
	readonly invalidId = signal<boolean>(false);
	readonly bookId = signal<string | null>(null);

	/**
	 * Computed helpers for template convenience
	 */
	readonly authorsText = computed(() => {
		const b = this.book();
		return b?.authors?.length ? b.authors.join(", ") : "";
	});

	/** Controls whether the full description is shown */
	readonly showFullDescription = signal(false);

	/** Precomputed star states for template ("full" | "half" | "empty") */
	readonly ratingStars = computed(() => {
		const r = this.book()?.averageRating ?? 0;
		return [1, 2, 3, 4, 5].map((i) => {
			if (r >= i) return "full";
			if (r >= i - 0.5) return "half";
			return "empty";
		});
	});

	ngOnInit(): void {
		requestAnimationFrame(() => this.viewport.scrollToPosition([0, 0]));
		const bookId = this.route.snapshot.paramMap.get("id");
		this.bookId.set(bookId);

		if (!bookId || Number.isNaN(Number(bookId))) {
			this.invalidId.set(true);
			this.error.set("Invalid book ID provided");
			return;
		}

		this.loadBook(Number(bookId));
	}

	/**
	 * Handle image loading errors
	 */
	onImageError(): void {
		this.imageError.set(true);
	}

	/**
	 * Detect low-resolution images on load and avoid upscaling them.
	 */
	onImageLoad(event: Event): void {
		const img = event.target as HTMLImageElement | null;
		if (!img) return;

		const { naturalWidth, naturalHeight } = img;
		if (!(naturalWidth > 0 && naturalHeight > 0)) {
			this.imageWidth.set(null);
			return;
		}

		// Measure the available container width (fall back to viewport width).
		const container = img.parentElement as HTMLElement | null;
		const containerWidth = container
			? container.clientWidth
			: window.innerWidth;

		// If the image is narrower than the container and below a reasonable
		// threshold, render it at intrinsic px size to avoid upscaling.
		const shouldUseIntrinsic =
			naturalWidth < containerWidth &&
			(naturalWidth < 300 || naturalHeight < 400);
		this.imageWidth.set(shouldUseIntrinsic ? naturalWidth : null);
	}

	/**
	 * Load book details by ID
	 */
	private loadBook(id: number): void {
		this.loading.set(true);
		this.error.set(null);
		this.imageError.set(false);

		this.booksApi.getBookById(id).subscribe({
			next: (book) => {
				this.book.set(book);
				this.loading.set(false);
				// After the view updates, ensure we're at the top of the viewport.
				requestAnimationFrame(() => this.viewport.scrollToPosition([0, 0]));
			},
			error: (err) => {
				this.error.set(err.message || "Failed to load book details");
				this.loading.set(false);
			},
		});
	}

	/**
	 * Navigate back to search
	 */
	goBack(): void {
		this.router.navigate(["/search"]);
	}

	/**
	 * Navigate to home page
	 */
	goHome(): void {
		this.router.navigate(["/"]);
	}

	/**
	 * Try to search for books
	 */
	searchBooks(): void {
		this.router.navigate(["/search"]);
	}

	/**
	 * Navigate to a specific book by ID
	 */
	navigateToBook(id: number): void {
		this.router.navigate(["/book/details", id]);
	}

	/** Toggle description collapsed state */
	toggleDescription(): void {
		this.showFullDescription.update((v) => !v);
	}
}
