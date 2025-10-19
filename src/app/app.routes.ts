import type { Routes } from "@angular/router";

export const routes: Routes = [
	{
		path: "",
		loadComponent: () =>
			import("./components/landing-component/landing-component").then(
				(m) => m.LandingComponent,
			),
	},
	{
		path: "search",
		loadComponent: () =>
			import("./components/book-search-component/book-search-component").then(
				(m) => m.BookSearchComponent,
			),
	},
	{
		path: "contact",
		loadComponent: () =>
			import("./components/contact-component/contact-component").then(
				(m) => m.ContactComponent,
			),
	},
	{
		path: "book/details/:id",
		loadComponent: () =>
			import("./components/book-details-component/book-details-component").then(
				(m) => m.BookDetailsComponent,
			),
	},
	// fallback
	{ path: "**", redirectTo: "" },
];
