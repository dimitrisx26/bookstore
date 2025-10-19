import { Injectable } from "@angular/core";
import type { IBook } from "../models/book.model";

@Injectable({
	providedIn: "root",
})
export class LocalStorageService {
	/**
	 * Save an item to local storage after stringifying it to JSON.
	 * @param key The key under which to store the item
	 * @param value The item to store
	 */
	setItem(key: string, value: IBook): void {
		try {
			const jsonValue = JSON.stringify(value);
			localStorage.setItem(key, jsonValue);
		} catch (error) {
			console.error("Error saving to local storage", error);
		}
	}

	/**
	 * Retrieve an item from local storage and parse it as JSON.
	 * @param key The key of the item to retrieve
	 * @returns The parsed item or null if not found or on error
	 */
	getItem<T>(key: string): IBook | null {
		try {
			const value = localStorage.getItem(key);
			return value ? JSON.parse(value) : null;
		} catch (error) {
			console.error("Error reading from local storage", error);
			return null;
		}
	}

	/**
	 * Retrieve all items from local storage and parse them as JSON.
	 * @returns An array of all parsed items
	 */
	getItems(): IBook[] {
		const books: IBook[] = [];

		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);

			if (key) {
				const item = this.getItem<IBook>(key);
				if (item) {
					books.push(item);
				}
			}
		}

		return books;
	}
}
