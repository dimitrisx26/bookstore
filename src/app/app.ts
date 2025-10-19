import { Component, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { FooterComponent } from "./components/footer-component/footer-component";
import { HeaderComponent } from "./components/header-component/header-component";

@Component({
	selector: "app-root",
	imports: [
		HeaderComponent,
		FooterComponent,

		// Angular
		RouterOutlet,
	],
	templateUrl: "./app.html",
	styleUrl: "./app.css",
})
export class App {
	protected readonly title = signal("bookstore");
}
