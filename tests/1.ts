import { engine, implEngine } from "../mod.ts";

const str = `header1,header2,"header3"
values,more values, even more`;

const e = await engine(str).run(implEngine<typeof str>());
const p = e.search("hi")