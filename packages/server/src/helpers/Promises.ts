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
