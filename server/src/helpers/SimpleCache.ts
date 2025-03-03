/**
 * A simple cache implementation with max size and TTL functionality
 */
class SimpleCache<T> {
	private cache: Map<string, { value: T; timestamp: number }>;
	private readonly maxSize: number;
	private readonly ttl: number; // Time to live (ttl) for cache entries in milliseconds

	/**
	 * Creates a new SimpleCache instance
	 * @param maxSize Maximum number of keys allowed in the cache
	 * @param ttl Time to live in milliseconds (0 for no expiration)
	 */
	constructor(maxSize = 10, ttl: number = 1000 * 60 * 60 * 2) {
		this.cache = new Map();
		this.maxSize = maxSize;
		this.ttl = ttl;
	}

	/**
	 * Sets a value in the cache
	 * @param key The key to set
	 * @param value The value to set
	 * @returns The cache instance for chaining
	 */
	set(key: string, value: T): SimpleCache<T> {
		// If the cache is at max capacity and this is a new key, remove oldest
		if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
			this.removeOldest();
		}

		// Set/update the entry with current timestamp
		this.cache.set(key, { value, timestamp: Date.now() });
		return this;
	}

	/**
	 * Gets a value from the cache
	 * @param key The key to retrieve
	 * @returns The value or undefined if not found
	 */
	get(key: string): T | undefined {
		const entry = this.cache.get(key);
		if (!entry) return undefined;

		// Check if entry has expired
		if (this.ttl !== 0 && Date.now() - entry.timestamp > this.ttl) {
			this.cache.delete(key);
			return undefined;
		}

		return entry.value;
	}

	/**
	 * Checks if a key exists in the cache
	 * @param key The key to check
	 * @returns True if the key exists and hasn't expired
	 */
	has(key: string): boolean {
		const entry = this.cache.get(key);
		if (!entry) return false;

		// Check if entry has expired
		if (this.ttl !== 0 && Date.now() - entry.timestamp > this.ttl) {
			this.cache.delete(key);
			return false;
		}

		return true;
	}

	/**
	 * Deletes a key from the cache
	 * @param key The key to delete
	 * @returns True if the key was deleted
	 */
	delete(key: string): boolean {
		return this.cache.delete(key);
	}

	/**
	 * Clears the entire cache
	 */
	clear(): void {
		this.cache.clear();
	}

	/**
	 * Returns the current size of the cache
	 * @returns Number of items in the cache
	 */
	size(): number {
		return this.cache.size;
	}

	/**
	 * Removes the oldest entry in the cache
	 * @private
	 */
	private removeOldest(): void {
		// Remove the oldest entry by using the insertion order of Map
		const oldestKey = this.cache.keys().next().value;
		if (oldestKey) {
			this.cache.delete(oldestKey);
		}
	}
}

export default new SimpleCache();
