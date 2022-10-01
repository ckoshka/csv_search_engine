export const toArray = async function <A>(
	iter: AsyncIterable<A> | AsyncGenerator<A>,
) {
	let counter = 0;
	const arr = [];
	for await (const item of iter) {
		arr[counter] = item;
		counter++;
	}
	return arr;
};