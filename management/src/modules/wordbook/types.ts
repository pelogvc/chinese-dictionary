import { ActionType } from "typesafe-actions";
import * as actions from "./actions";

export type WordbookAction = ActionType<typeof actions>;

export type Word = {
  collectionRanking: any;
  created: any;
  range: any;
  LAIMLog: any;
  exactMatcheEntryUrl: any;
  mayBeKey: any;
  mode: any;
  searchResultMap: any;
  query: string;
};

export type WordbookState = {
  page: number;
  words: Word[];
  done: boolean;
};

// https://jvilk.com/MakeTypes/
/*
export interface Word {
  searchResultMap: SearchResultMap;
  mode?: null;
  exactMatcheEntryUrl: boolean;
  collectionRanking?: (string)[] | null;
  LAIMLog: boolean;
  query: string;
  range?: null;
  mayBeKey: string;
  created: string;
  id: number;
}
export interface SearchResultMap {
  searchResultListMap: SearchResultListMap;
}
export interface SearchResultListMap {
  WORD: WORD;
  MEANING: MEANING;
  EXAMPLE: EXAMPLE;
  VLIVE: VLIVE;
  RECOMMENDENTRY: RECOMMENDENTRY;
}
export interface WORD {
  query: string;
  queryRevert: string;
  items?: (ItemsEntity)[] | null;
  total: number;
  sectionType: string;
  revert?: null;
  orKEquery?: null;
}
export interface ItemsEntity {
  rank: string;
  gdid: string;
  matchType: string;
  entryId: string;
  serviceCode: string;
  languageCode: string;
  expDictTypeForm: string;
  dictTypeForm: string;
  sourceDictnameKO: string;
  sourceDictnameOri: string;
  sourceDictnameLink: string;
  sourceUpdate: string;
  dictTypeWriter?: null;
  dictTypeMulti: string;
  expEntry: string;
  expEntrySuperscript: string;
  destinationLink: string;
  destinationLinkKo: string;
  expAliasEntryAlways: string;
  expAliasEntryAlwaysOld?: null;
  expAliasEntrySearch: string;
  expAliasEntrySearchKrKind?: null;
  expAliasEntrySearchAllKind?: null;
  expAliasGeneralAlways: string;
  expAliasGeneralSearch: string;
  expConjugationMoreURL?: null;
  conjugate: string;
  expSynonym?: null;
  expAntonym?: null;
  expPhoneticSymbol1M?: null;
  expPhoneticSymbol1PC?: null;
  expPhoneticSymbol1Path: string;
  expPhoneticSymbol2M?: null;
  expPhoneticSymbol2PC?: null;
  expPhoneticSymbol2Path: string;
  pronunFileCount: number;
  priority: number;
  isHighDfTerm: number;
  isOpenDict: number;
  isPhoneticSymbol: number;
  isConjugation: number;
  isIdiom: number;
  isExample: number;
  isStudy: number;
  isImage: number;
  isSource: number;
  isOrigin: number;
  meaningCount: number;
  entryImageURL: string;
  etcExplain: string;
  idiomOri: string;
  idiomOriUrl: string;
  phoneticSymbol?: null;
  frequencyAdd: string;
  meansCollector?: (MeansCollectorEntity)[] | null;
  similarWordList?: (null)[] | null;
  antonymWordList?: (null)[] | null;
  expAliasEntryAlwaysList?: (null)[] | null;
  expAliasGeneralAlwaysList?: (null)[] | null;
  expAliasEntrySearchList?: (null)[] | null;
  searchPhoneticSymbolList?: (SearchPhoneticSymbolListEntity)[] | null;
  searchVariantHanziList?: (null)[] | null;
  searchTraditionalChineseList?: (null)[] | null;
  handleEntry: string;
  vcode: string;
  encode: string;
  exactMatch: boolean;
}
export interface MeansCollectorEntity {
  partOfSpeech: string;
  partOfSpeech2: string;
  means?: (MeansEntity)[] | null;
}
export interface MeansEntity {
  order: string;
  value: string;
  subjectGroup: string;
  languageGroup: string;
  example?: null;
  userId: string;
  uuid: string;
  userNickName?: null;
  groupName: string;
  groupId: string;
  sourceUpdate: string;
  handleValue?: null;
  exampleOri: string;
  exampleTrans: string;
  vcode: string;
  encode: string;
}
export interface SearchPhoneticSymbolListEntity {
  phoneticSymbolType: string;
  phoneticSymbol: string;
  phoneticSymbolPath: string;
}
export interface MEANING {
  query: string;
  queryRevert: string;
  items?: (ItemsEntity1)[] | null;
  total: number;
  sectionType: string;
  revert?: null;
  orKEquery?: null;
}
export interface ItemsEntity1 {
  rank: string;
  gdid: string;
  matchType: string;
  entryId: string;
  serviceCode: string;
  languageCode: string;
  expDictTypeForm: string;
  dictTypeForm: string;
  sourceDictnameKO: string;
  sourceDictnameOri: string;
  sourceDictnameLink: string;
  sourceUpdate: string;
  dictTypeWriter?: null;
  dictTypeMulti: string;
  expEntry: string;
  expEntrySuperscript: string;
  destinationLink: string;
  destinationLinkKo: string;
  expAliasEntryAlways: string;
  expAliasEntryAlwaysOld?: null;
  expAliasEntrySearch: string;
  expAliasEntrySearchKrKind?: null;
  expAliasEntrySearchAllKind?: null;
  expAliasGeneralAlways: string;
  expAliasGeneralSearch: string;
  expConjugationMoreURL?: null;
  conjugate: string;
  expSynonym?: null;
  expAntonym?: null;
  expPhoneticSymbol1M?: null;
  expPhoneticSymbol1PC?: null;
  expPhoneticSymbol1Path: string;
  expPhoneticSymbol2M?: null;
  expPhoneticSymbol2PC?: null;
  expPhoneticSymbol2Path: string;
  pronunFileCount: number;
  priority: number;
  isHighDfTerm: number;
  isOpenDict: number;
  isPhoneticSymbol: number;
  isConjugation: number;
  isIdiom: number;
  isExample: number;
  isStudy: number;
  isImage: number;
  isSource: number;
  isOrigin: number;
  meaningCount: number;
  entryImageURL: string;
  etcExplain: string;
  idiomOri: string;
  idiomOriUrl: string;
  phoneticSymbol?: null;
  frequencyAdd: string;
  meansCollector?: (MeansCollectorEntity)[] | null;
  similarWordList?: (null)[] | null;
  antonymWordList?: (null)[] | null;
  expAliasEntryAlwaysList?: (null)[] | null;
  // tslint:disable-next-line: array-type
  expAliasGeneralAlwaysList?: (ExpAliasGeneralAlwaysListEntity | null)[] | null;
  expAliasEntrySearchList?: (null)[] | null;
  // tslint:disable-next-line: array-type
  searchPhoneticSymbolList?: (SearchPhoneticSymbolListEntity1 | null)[] | null;
  searchVariantHanziList?: (null)[] | null;
  searchTraditionalChineseList?: (null)[] | null;
  handleEntry: string;
  vcode: string;
  encode: string;
  exactMatch: boolean;
}
export interface ExpAliasGeneralAlwaysListEntity {
  originLanguage: string;
}
export interface SearchPhoneticSymbolListEntity1 {
  phoneticSymbolType: string;
  phoneticSymbol: string;
  phoneticSymbolPath: string;
}
export interface EXAMPLE {
  query: string;
  queryRevert?: null;
  items?: (ItemsEntity2)[] | null;
  total: number;
  sectionType: string;
  revert?: null;
  orKEquery?: null;
}
export interface ItemsEntity2 {
  rank: string;
  gdid: string;
  matchType: string;
  exampleId: string;
  serviceCode: string;
  exampleLangCode: string;
  languageIntCode: string;
  dictTypeForm: string;
  dictTypeWriter?: null;
  sourceDictnameKO: string;
  sourceDictnameOri: string;
  sourceDictnameURL: string;
  sourceDictnameAddKO: string;
  sourceDictnameAddURL?: null;
  sourceUpdate: string;
  haveTrans: string;
  example1Lang: number;
  expExample1: string;
  expExampleAutoLink?: null;
  expExample1Pronun: string;
  example2Lang: string;
  expExample2: string;
  example3Lang?: null;
  expExample3?: null;
  expExampleURL: string;
  expEntry: string;
  superscript: string;
  expEntryURL: string;
  translationId?: null;
  translation?: null;
  translationAutoLink?: null;
  languageCode?: null;
  sourceDictnameImage?: null;
  detailLink: string;
  translationUserId?: null;
  translationUserlink?: null;
  translationUserNickname?: null;
  translationParticipationCount?: null;
  translationHonorYear?: null;
  exampleVcode: string;
  exampleEncode: string;
  translationVcode: string;
  translationEncode: string;
}
export interface VLIVE {
  query: string;
  queryRevert?: null;
  items?: (ItemsEntity3)[] | null;
  total: number;
  sectionType: string;
  revert?: null;
  orKEquery?: null;
}
export interface ItemsEntity3 {
  rank: string;
  gdid: string;
  matchType: string;
  exampleId: string;
  serviceCode: string;
  exampleLangCode: string;
  languageIntCode?: null;
  dictTypeForm: string;
  dictTypeWriter?: null;
  sourceDictnameKO: string;
  sourceDictnameOri: string;
  sourceDictnameURL: string;
  sourceDictnameAddKO: string;
  sourceDictnameAddURL?: null;
  sourceUpdate: string;
  haveTrans: string;
  example1Lang: number;
  expExample1: string;
  expExampleAutoLink?: null;
  expExample1Pronun?: null;
  example2Lang: string;
  expExample2: string;
  example3Lang: string;
  expExample3: string;
  expExampleURL: string;
  expEntry: string;
  superscript: string;
  expEntryURL: string;
  translationId?: null;
  translation?: null;
  translationAutoLink?: null;
  languageCode?: null;
  sourceDictnameImage: string;
  detailLink: string;
  translationUserId?: null;
  translationUserlink?: null;
  translationUserNickname?: null;
  translationParticipationCount?: null;
  translationHonorYear?: null;
  vlive1Vcode: string;
  vlive2Vcode: string;
  vlive3Vcode: string;
  vlive1Encode: string;
  vlive2Encode: string;
  vlive3Encode: string;
  exampleVcode: string;
  exampleEncode: string;
  translationVcode: string;
  translationEncode: string;
}
export interface RECOMMENDENTRY {
  query: string;
  queryRevert: string;
  items?: (null)[] | null;
  total: number;
  sectionType: string;
  revert?: null;
  orKEquery?: null;
}

export interface WordbookState {
  page: number;
  words: Word[];
}
*/
