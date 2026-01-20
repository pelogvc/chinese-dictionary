import { MESSAGE_TYPES, type DictionaryWindowMessage } from '@/types/messages'
import { isChinese } from '@/lib/api'

const CONTAINER_ID = 'chrome_extension_chinese_dictionary'
const isInIframe = window.top !== window.self

function createContainer(): HTMLDivElement | null {
  if (document.getElementById(CONTAINER_ID)) return null
  if (isInIframe) return null

  const container = document.createElement('div')
  container.id = CONTAINER_ID
  container.innerHTML = `
    <div class="cecd-content"></div>
  `

  const style = document.createElement('style')
  style.textContent = `
    #${CONTAINER_ID} {
      display: none;
      position: fixed;
      top: 20px;
      right: 20px;
      width: 350px;
      max-height: 400px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08);
      z-index: 2147483647;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      overflow: hidden;
      border: 2px solid #E5E5E5;
    }
    #${CONTAINER_ID}.open {
      display: block;
    }
    #${CONTAINER_ID} .cecd-content {
      height: 350px;
    }
    #${CONTAINER_ID} .cecd-content iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
  `

  document.head.appendChild(style)
  document.body.appendChild(container)

  return container
}

function showDictionary(word: string): void {
  if (isInIframe) {
    window.parent.postMessage({ chinese_dictionary_word: word } satisfies DictionaryWindowMessage, '*')
    return
  }

  let container = document.getElementById(CONTAINER_ID) as HTMLDivElement | null
  if (!container) {
    container = createContainer()
  }

  if (!container) return

  container.classList.add('open')
  const content = container.querySelector('.cecd-content')
  if (content) {
    const searchUrl = chrome.runtime.getURL(`src/pages/search/index.html?search=${encodeURIComponent(word)}`)
    content.innerHTML = `<iframe src="${searchUrl}" title="검색 결과"></iframe>`
  }
}

function hideDictionary(): void {
  if (isInIframe) {
    window.parent.postMessage({ chinese_dictionary_window: 1 } satisfies DictionaryWindowMessage, '*')
    return
  }

  const container = document.getElementById(CONTAINER_ID)
  container?.classList.remove('open')
}

function handleMessage(event: MessageEvent<unknown>): void {
  const data = event.data as DictionaryWindowMessage | null
  if (!data) return

  if (data.chinese_dictionary_window === 1) {
    hideDictionary()
    return
  }

  if (data.chinese_dictionary_word) {
    showDictionary(data.chinese_dictionary_word)
  }
}

function handleMouseUp(): void {
  const selection = document.getSelection()
  const selectedText = selection?.toString().trim() ?? ''

  if (!selectedText || !isChinese(selectedText)) {
    hideDictionary()
    return
  }

  showDictionary(selectedText)
}

function handleExtensionMessage(message: unknown): void {
  const msg = message as { name?: string; selectedText?: string }
  if (msg.name === MESSAGE_TYPES.CONTEXTMENU_SEARCH && msg.selectedText) {
    showDictionary(msg.selectedText)
  }
}

window.addEventListener('message', handleMessage)
document.addEventListener('mouseup', handleMouseUp)
chrome.runtime.onMessage.addListener(handleExtensionMessage)
void chrome.runtime.sendMessage({ type: MESSAGE_TYPES.INITIALIZE })
