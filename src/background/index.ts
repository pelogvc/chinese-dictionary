import { MESSAGE_TYPES } from '@/types/messages'
import { CONTEXT_MENU_ID } from '@/constants'

const NAVER_HEADER_RULES: chrome.declarativeNetRequest.Rule[] = [
  {
    id: 1,
    priority: 1,
    action: {
      type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
      requestHeaders: [
        {
          header: 'Referer',
          operation: chrome.declarativeNetRequest.HeaderOperation.SET,
          value: 'https://zh.dict.naver.com/',
        },
        {
          header: 'Accept-Language',
          operation: chrome.declarativeNetRequest.HeaderOperation.SET,
          value: 'ko-KR,ko;q=0.9',
        },
      ],
    },
    condition: {
      urlFilter: '*://zh.dict.naver.com/*',
      resourceTypes: [chrome.declarativeNetRequest.ResourceType.XMLHTTPREQUEST],
    },
  },
  {
    id: 2,
    priority: 1,
    action: {
      type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
      requestHeaders: [
        {
          header: 'Referer',
          operation: chrome.declarativeNetRequest.HeaderOperation.SET,
          value: 'https://zh.dict.naver.com/',
        },
      ],
    },
    condition: {
      urlFilter: '*://learn.dict.naver.com/*',
      resourceTypes: [chrome.declarativeNetRequest.ResourceType.XMLHTTPREQUEST],
    },
  },
]

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: CONTEXT_MENU_ID,
    title: "도토리 중국어사전에서 '%s' 검색",
    contexts: ['selection'],
  })

  void chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1, 2],
    addRules: NAVER_HEADER_RULES,
  })
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== CONTEXT_MENU_ID) return
  if (!tab?.id || !info.selectionText) return

  void chrome.tabs.sendMessage(tab.id, {
    name: MESSAGE_TYPES.CONTEXTMENU_SEARCH,
    selectedText: info.selectionText,
  })
})

chrome.runtime.onMessage.addListener((message: unknown, _sender, sendResponse) => {
  const msg = message as { type?: string; query?: string; text?: string }

  if (msg.type === MESSAGE_TYPES.INITIALIZE) {
    console.log('Content script initialized')
    return
  }

  if (msg.type === MESSAGE_TYPES.SEARCH_WORD && msg.query) {
    const url = new URL('https://zh.dict.naver.com/api3/zhko/search')
    url.searchParams.set('query', msg.query)
    url.searchParams.set('m', 'pc')
    url.searchParams.set('lang', 'ko')

    fetch(url.toString())
      .then((res) => res.json())
      .then((data) => { sendResponse({ success: true, data }) })
      .catch((err: Error) => { sendResponse({ success: false, error: err.message }) })

    return true
  }

  if (msg.type === MESSAGE_TYPES.GET_AUDIO && msg.text) {
    const url = new URL('https://learn.dict.naver.com/tts')
    url.searchParams.set('speaker', 'zh_cn')
    url.searchParams.set('service', 'today-conversation')
    url.searchParams.set('domain', 'naver')
    url.searchParams.set('from', 'mobile')
    url.searchParams.set('speech_fmt', 'mp3')
    url.searchParams.set('text', msg.text)

    fetch(url.toString())
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)))
        sendResponse({ success: true, data: base64 })
      })
      .catch((err: Error) => { sendResponse({ success: false, error: err.message }) })

    return true
  }
})
