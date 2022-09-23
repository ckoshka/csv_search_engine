import { Fuse, readCSVObjects, StringReader } from "./deps.ts";
import { GetHeaders } from "./types.ts";

export type FuseType<T> = {
	search: (query: string) => {
		item: T;
		refIndex: number;
		score: number;
	}[];
};

const toArray = async function <A>(
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

export const engine = <T extends string>(
	csv: T,
	excludeKeys?: string[],
) => toArray(readCSVObjects(new StringReader(csv)))
	.then(
		(data) =>
			new Fuse(data, {
				keys: Object.keys(data[0]).filter((k) =>
					excludeKeys ? !excludeKeys.includes(k) : true
				),
				threshold: 1.0,
				ignoreLocation: true,
				includeScore: true
			}) as FuseType<GetHeaders<T>>,
	);

export const engineFromStrings = (data: string[]) =>
	new Fuse(data, { threshold: 1.0, ignoreLocation: true, includeScore: true }) as FuseType<
		string
	>;

export const engineFromTsv = <T extends string>(tsv: T) =>
	new Fuse(
		tsv.split("\n").slice(1, -1).map((e) =>
			e.split("\t").filter((e) => e.length > 0).join(" ")
		),
		{ threshold: 1.0, ignoreLocation: true, includeScore: true },
	) as FuseType<string>;