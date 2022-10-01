import { Fuse, readCSVObjects, StringReader, use } from "./deps.ts";
import { Csv, Flatten, GetHeaders, Tsv } from "./types.ts";
import { toArray } from "./utils.ts";

export interface SearchEngine<T> {
	search: (query: string) => {
		item: T;
		score: number;
	}[];
}

export type SearchEngineConstructor<T> = {
	createSearchEngine: (data: T[]) => SearchEngine<T>;
};

export const implEngine = <T extends string>() => ({
	createSearchEngine: (data: {
		[key: string]: string;
	}[], excludeKeys?: string[]) =>
		new Fuse(data, {
			keys: Object.keys(data[0]).filter((k) =>
				excludeKeys ? !excludeKeys.includes(k) : true
			),
			threshold: 1.0,
			ignoreLocation: true,
			includeScore: true,
		}) as SearchEngine<Csv<T>>,
});

export const engine = <Data extends string>(
	csv: Data,
) => use<SearchEngineConstructor<Csv<Data>>>()
	.of(new StringReader(csv))
	.map((r) => readCSVObjects(r))
	.map(toArray)
	.map((arr, fx) =>
		fx.createSearchEngine(arr as Csv<Data>[]) as SearchEngine<Csv<Data>>
	);
