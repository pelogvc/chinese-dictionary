import { ActionType } from "typesafe-actions";
import * as actions from "./actions";

export type WordbookAction = ActionType<typeof actions>;

export type Means = {
  langType: string;
  entry: string;
  sourceDictnameKO: string;
  sourceDictnameOri: string;
  destinationLink: string;
  destinationLinkKo: string;
  meansCollector?: (MeansCollector)[] | null;
  phoneticSymbol?: (PhoneticSymbol)[] | null;
};
export type PhoneticSymbol = {
  phoneticSymbolType: string;
  phoneticSymbol: string;
  phoneticSymbolPath: string;
}
export type MeansCollector = {
  partOfSpeech: string;
  means?: (MeansEntity)[] | null;
};
export type MeansEntity = {
  exampleOri: string;
  value: string;
};
export type Examples = {
  langType: string;
  entry: string;
  exampleZh: string;
  examplePinyin: string;
  exampleKo: string;
  sourceDictnameKO: string;
  sourceDictnameOri: string;
  sourceDictnameURL: string;
};
export type Word = {
  query: string;
  created: string;
  examples?: (Examples)[] | null;
  means?: (Means)[] | null;
  id: number;
  key?: number;
};
export type WordbookState = {
  page: number;
  words: Word[];
  done: boolean;
  count: number;
};
