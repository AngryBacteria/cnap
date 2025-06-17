import { describe, expect, it } from "vitest";
import { difference } from "./General.js";

describe("difference", () => {
	it("returns items in list1 not in list2", () => {
		expect(difference(["a", "b", "c"], ["b", "d"])).toEqual(["a", "c"]);
	});

	it("returns all items if list2 is empty", () => {
		expect(difference(["a", "b", "c"], [])).toEqual(["a", "b", "c"]);
	});

	it("returns empty array if list1 is empty", () => {
		expect(difference([], ["a", "b", "c"])).toEqual([]);
	});

	it("returns empty array if all items in list1 are in list2", () => {
		expect(difference(["a", "b"], ["a", "b", "c"])).toEqual([]);
	});

	it("handles duplicate items in list1", () => {
		expect(difference(["a", "a", "b"], ["b"])).toEqual(["a", "a"]);
	});

	it("handles duplicate items in list2", () => {
		expect(difference(["a", "b", "c"], ["b", "b", "d"])).toEqual(["a", "c"]);
	});

	it("returns correct result when both lists are empty", () => {
		expect(difference([], [])).toEqual([]);
	});

	it("is case sensitive", () => {
		expect(difference(["A", "a"], ["a"])).toEqual(["A"]);
	});
});
