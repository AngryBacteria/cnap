import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	createAdminPassword,
	difference,
	to,
	URLToBase64,
	verifyAdminPassword,
} from "./General.js";

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

describe("to function", () => {
	it("should return [data, null] when promise resolves", async () => {
		const promise = Promise.resolve("success");
		const result = await to(promise);

		expect(result).toEqual(["success", null]);
		expect(result[0]).toBe("success");
		expect(result[1]).toBeNull();
	});

	it("should return [null, error] when promise rejects", async () => {
		const error = new Error("test error");
		const promise = Promise.reject(error);
		const result = await to(promise);

		expect(result).toEqual([null, error]);
		expect(result[0]).toBeNull();
		expect(result[1]).toBe(error);
	});
});

describe("URLToBase64", () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it("should fetch a URL and return base64 string with MIME type", async () => {
		const mockData = new Uint8Array([72, 101, 108, 108, 111]);
		const mockBase64 = Buffer.from(mockData).toString("base64");
		const mockMimeType = "text/plain";

		const mockFetch = vi.fn().mockResolvedValue({
			arrayBuffer: vi.fn().mockResolvedValue(mockData.buffer),
			headers: {
				get: vi.fn().mockReturnValue(mockMimeType),
			},
		});
		globalThis.fetch = mockFetch as unknown as typeof fetch;

		const result = await URLToBase64("https://example.com/file.txt");
		expect(mockFetch).toHaveBeenCalledWith("https://example.com/file.txt");
		expect(result).toEqual({ base64: mockBase64, mimeType: mockMimeType });
	});

	it("should throw an error if MIME type is missing", async () => {
		const mockData = new Uint8Array([72, 101, 108, 108, 111]);

		const mockFetch = vi.fn().mockResolvedValue({
			arrayBuffer: vi.fn().mockResolvedValue(mockData.buffer),
			headers: {
				get: vi.fn().mockReturnValue(null),
			},
		});

		globalThis.fetch = mockFetch as unknown as typeof fetch;
		await expect(URLToBase64("https://example.com/no-mime")).rejects.toThrow(
			"Could not determine MIME type",
		);
	});
});

describe("Password Utilities", () => {
	describe("createAdminPassword", () => {
		it("should return a salt and hash as base64 strings", () => {
			const password = "mySecurePassword";
			const result = createAdminPassword(password);

			expect(result).toHaveProperty("salt");
			expect(result).toHaveProperty("hash");
			expect(typeof result.salt).toBe("string");
			expect(typeof result.hash).toBe("string");

			expect(() => Buffer.from(result.salt, "base64")).not.toThrow();
			expect(() => Buffer.from(result.hash, "base64")).not.toThrow();
		});

		it("should generate a unique salt for every call", () => {
			const res1 = createAdminPassword("password");
			const res2 = createAdminPassword("password");

			expect(res1.salt).not.toBe(res2.salt);
			expect(res1.hash).not.toBe(res2.hash);
		});
	});
});
