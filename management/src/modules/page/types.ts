import { ActionType } from "typesafe-actions";
import * as actions from "./actions";

export type PageAction = ActionType<typeof actions>;

export type Page = {
  id: string;
};

export type PageState = Page;
