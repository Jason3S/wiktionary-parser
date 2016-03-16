

interface IWiktionaryPageRevision {
    contentformat: string; // ex: "text/x-wiki",
    contentmodel: string;  // ex: "wikitext",
    "*": string; // "==English==\n{{wikipedia|walk}}"
}

interface IWiktionaryPage {
    pageid: number;
    ns: number; // namespace
    title: string;
    revisions: IWiktionaryPageRevision[];
    contentmodel: string; // ex: "wikitext",
    pagelanguage: string; // ex: "en",
    pagelanguagehtmlcode: string; // ex: "en",
    pagelanguagedir: string; // ex: "ltr",
    touched: string; // ex: "2016-01-17T18:55:09Z",
    lastrevid: number; // ex: 36262557,
    length: number; // ex: 27727
}

interface IWiktionaryQuery {
    pages: { [index: string]: IWiktionaryPage };
}

interface IWiktionaryQueryResult {
    batchcomplete: string;
    query : IWiktionaryQuery;
}

