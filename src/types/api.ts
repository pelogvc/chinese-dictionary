export interface NaverDictionaryResponse {
  searchResultMap: {
    searchResultListMap: {
      WORD: WordResult
      EXAMPLE?: ExampleResult
    }
  }
}

export interface WordResult {
  query: string
  queryRevert: string
  items: WordItem[]
}

export interface WordItem {
  rank: string
  gdid: string
  handleEntry: string
  expEntry: string
  destinationLink: string
  destinationLinkKo: string
  sourceDictnameKO: string
  sourceDictnameOri: string
  expDictTypeForm: string
  searchPhoneticSymbolList: PhoneticSymbol[]
  meansCollector: MeansCollector[]
  expOnly: string
  hasExample: number
  vcode: string
  encode: string
}

export interface PhoneticSymbol {
  symbolType: string
  symbolTypeCode: string
  symbolValue: string
  symbolFile: string
  symbolAccentiaImg: string
  symbolAccentiaAudioCnt: string
}

export interface MeansCollector {
  partOfSpeech: string
  partOfSpeech2: string
  partOfSpeechCode: string
  means: Mean[]
}

export interface Mean {
  order: string
  value: string
  subjectGroup: string
  subjectGroupCode: string
  languageGroup: string
  languageGroupCode: string
  exampleOri: string
  exampleTrans: string
  vcode: string
  encode: string
}

export interface ExampleResult {
  query: string
  items: ExampleItem[]
}

export interface ExampleItem {
  expEntry: string
  expExample1: string
  expExample1Pronun: string
  expExample2: string
  exampleLangCode: string
  sourceDictnameKO: string
  sourceDictnameOri: string
}

export interface ParsedWord {
  word: string
  pinyin: string | null
  link: string | null
  means: ParsedMean[]
  audioUrl: string
}

export interface ParsedMean {
  partOfSpeech: string | null
  value: string
}
