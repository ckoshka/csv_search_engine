export type Flatten<T> = T extends Record<string, unknown>
	? { [k in keyof T]: T[k] }
	: never;

export type Entry<
	T extends string,
	Separator extends string,
> = T extends `${infer P1},${infer P2}`
	? Flatten<Record<P1, string> & Entry<P2, Separator>>
	: Record<T, string>;

export type Csv<T extends string> = T extends `${infer Row1}\n${string}`
	? Entry<Row1, ",">
	: T;

export type Tsv<T extends string> = T extends `${infer Row1}\n${string}`
	? Entry<Row1, ",">
	: T;

export type GetHeaders<T extends string> = Flatten<Csv<T>>;

export type GetHeadersTsv<T extends string> = Flatten<Tsv<T>>;
