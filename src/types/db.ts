export interface WordbookEntry {
  id?: number
  query: string
  created: Date
  examples: SavedExample[]
  means: SavedMean[]
}

export interface SavedExample {
  langType: string
  entry: string
  exampleZh: string
  examplePinyin: string
  exampleKo: string
  sourceDictnameKO: string
  sourceDictnameOri: string
  sourceDictnameURL: string
}

export interface SavedMean {
  langType: string
  entry: string
  sourceDictnameKO: string
  sourceDictnameOri: string
  sourceDictnameURL: string
  destinationLink: string
  destinationLinkKo: string
  meansCollector: SavedMeansCollector[]
  phoneticSymbol: SavedPhoneticSymbol[]
}

export interface SavedMeansCollector {
  partOfSpeech: string
  means: SavedMeanValue[]
}

export interface SavedMeanValue {
  code: string
  exampleOri: string
  value: string
}

export interface SavedPhoneticSymbol {
  phoneticSymbolType: string
  phoneticSymbol: string
  phoneticSymbolPath: string
}
