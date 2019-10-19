import Dexie from "dexie";
import WordbookDataBackup from "../assets/wordbookDataBackup.json";

export class WordbookDatabase extends Dexie {
  public wordbook: Dexie.Table<any, any>;
  private limit: number = 10;

  constructor() {
    super("chinese-dictionary");

    this.version(3).stores({
      wordbook: `++id, query, created, examples, means, [query+created]`
    });

    this.wordbook = this.table("wordbook");
    this.searchByPage.bind(this);
  }

  public async searchByPage(page: number) {
    const offset = ((page || 1) - 1) * this.limit;
    return this.wordbook
      .orderBy("id")
      .reverse()
      .offset(offset)
      .limit(this.limit)
      .toArray();
  }

  public async count() {
    return this.wordbook.count();
  }

  public async restore() {
    const json = WordbookDataBackup;
    json.map(async (v, i) => {
      delete v.id;
      this.wordbook.add(v);
    });
  }
}
