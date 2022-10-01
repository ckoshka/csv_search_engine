import { Maybe } from "./deps.ts";
import { SearchEngine } from "./engine.ts";

export const joinTables = <A, B>(
	f1: SearchEngine<A>,
	f2: SearchEngine<B>,
	mapfn: (a: A) => string,
) =>
(query: string): Maybe<B[]> => {
	const res = f1.search(query).at(0);
	if (res === undefined) {
		return Maybe.none();
	}
	const newq = mapfn(res["item"]);
	const res2 = f2.search(newq);
	return Maybe.some(res2.map((e) => e.item));
};