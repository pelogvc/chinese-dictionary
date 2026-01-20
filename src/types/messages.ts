export const MESSAGE_TYPES = {
  INITIALIZE: 'CHINESE_DICTIONARY_INITIALIZE',
  CONTEXTMENU_SEARCH: 'CHINESE_DICTIONARY_CONTEXTMENU_SEARCH',
  SEARCH_WORD: 'CHINESE_DICTIONARY_SEARCH_WORD',
  GET_AUDIO: 'CHINESE_DICTIONARY_GET_AUDIO',
} as const

export interface InitializeMessage {
  type: typeof MESSAGE_TYPES.INITIALIZE
}

export interface ContextMenuSearchMessage {
  name: typeof MESSAGE_TYPES.CONTEXTMENU_SEARCH
  selectedText: string
}

export interface SearchWordMessage {
  type: typeof MESSAGE_TYPES.SEARCH_WORD
  query: string
}

export interface GetAudioMessage {
  type: typeof MESSAGE_TYPES.GET_AUDIO
  text: string
}

export type ExtensionMessage = InitializeMessage | ContextMenuSearchMessage | SearchWordMessage | GetAudioMessage

export interface DictionaryWindowMessage {
  chinese_dictionary_window?: 1
  chinese_dictionary_word?: string
}
