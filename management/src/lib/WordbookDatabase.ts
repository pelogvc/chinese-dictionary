import Dexie from "dexie";

export class WordbookDatabase extends Dexie {
  public wordbook: Dexie.Table<any, any>;
  private limit: number = 10;

  constructor() {
    super("dictionary");

    this.version(2).stores({
      recentlyWords: `++id, LAIMLog, collectionRanking, exactMatcheEntryUrl, mayBeKey, mode, query, range, searchResultMap, created, [query+created]`
    });

    this.wordbook = this.table("recentlyWords");
    this.searchByPage.bind(this);
  }

  public async searchByPage(page: number) {
    const offset = ((page || 1) - 1) * 20;
    return await this.wordbook
      .orderBy("id")
      .reverse()
      .offset(offset)
      .limit(this.limit)
      .toArray();
  }
}
