import { timingSafeEqual } from "node:crypto";
import { pbkdf2Sync, randomBytes } from "crypto";
import {
	ADMIN_PASSWORD_HASH,
	ADMIN_PASSWORD_ITERATIONS,
	ADMIN_PASSWORD_SALT,
} from "./EnvironmentConfig.js";

export async function URLToBase64(
	url: string,
): Promise<{ base64: string; mimeType: string }> {
	const response = await fetch(url);
	const arrayBuffer = await response.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);
	const base64 = buffer.toString("base64");

	const mimeType = response.headers.get("content-type");
	if (!mimeType) {
		throw new Error("Could not determine MIME type");
	}

	return { base64, mimeType };
}

/**
 * Returns the difference between two arrays. Meaning that it returns the items
 * that are in `list1` but not in `list2`.
 */
export function difference(list1: string[], list2: string[]) {
	const set2 = new Set(list2);
	return list1.filter((item) => !set2.has(item));
}

type Success<T> = [T, null];
type Failure<E> = [null, E];
type Result<T, E = Error> = Success<T> | Failure<E>;

export async function to<T, E = Error>(
	promise: Promise<T>,
): Promise<Result<T, E>> {
	try {
		const data = await promise;
		return [data, null] as Success<T>;
	} catch (error) {
		return [null, error as E] as Failure<E>;
	}
}

export function createAdminPassword(password: string) {
	const salt = randomBytes(16);
	const hash = pbkdf2Sync(
		password,
		salt,
		ADMIN_PASSWORD_ITERATIONS,
		64,
		"sha512",
	);

	return {
		salt: salt.toString("base64"),
		hash: hash.toString("base64"),
	};
}

export function verifyAdminPassword(plainPassword: string): boolean {
	const adminPasswordHash = Buffer.from(ADMIN_PASSWORD_HASH, "base64");
	const adminPasswordSalt = Buffer.from(ADMIN_PASSWORD_SALT, "base64");

	const derived = pbkdf2Sync(
		plainPassword,
		adminPasswordSalt,
		ADMIN_PASSWORD_ITERATIONS,
		64,
		"sha512",
	);
	if (derived.length !== adminPasswordHash.length) return false;

	return timingSafeEqual(derived, adminPasswordHash);
}
