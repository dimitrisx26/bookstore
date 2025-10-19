import { TestBed } from "@angular/core/testing";

import { BooksSearchService } from "./books-search-service";

describe("BooksSearchService", () => {
	let service: BooksSearchService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(BooksSearchService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});
