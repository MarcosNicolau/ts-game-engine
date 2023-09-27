/**
 * copied and adapted from npm 'binary-search-insert'
 * @link https://www.npmjs.com/package/binary-search-insert
 */
export type CompareFunction<T = any> = (a: T, b: T) => number;

export const pushAtSortPosition = <T>(
	array: T[],
	item: T,
	compareFunction: CompareFunction<T>,
	low: number
) => {
	const length = array.length;

	let high = length - 1;
	let mid = 0;

	/**
	 * Optimization shortcut.
	 */
	if (length === 0) {
		array.push(item);
		return 0;
	}

	/**
	 * So we do not have to get the ret[mid] doc again
	 * at the last we store it here.
	 */
	let lastMidDoc: T;

	while (low <= high) {
		// https://github.com/darkskyapp/binary-search
		// http://googleresearch.blogspot.com/2006/06/extra-extra-read-all-about-it-nearly.html
		mid = low + ((high - low) >> 1);
		lastMidDoc = array[mid];
		if (compareFunction(lastMidDoc, item) <= 0.0) {
			// searching too low
			low = mid + 1;
		} else {
			// searching too high
			high = mid - 1;
		}
	}

	//@ts-expect-error gets assigned in the while loop
	if (compareFunction(lastMidDoc, item) <= 0.0) {
		mid++;
	}

	/**
	 * Insert at correct position
	 */
	array.splice(mid, 0, item);

	return mid;
};
