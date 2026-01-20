import type { NaverDictionaryResponse, ParsedWord, ParsedMean } from '@/types/api'
import { MESSAGE_TYPES } from '@/types/messages'

interface BackgroundResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export async function searchWord(query: string): Promise<NaverDictionaryResponse> {
  const response = await chrome.runtime.sendMessage({
    type: MESSAGE_TYPES.SEARCH_WORD,
    query,
  }) as BackgroundResponse<NaverDictionaryResponse>

  if (!response.success) {
    throw new Error(response.error ?? 'Search failed')
  }

  if (!response.data) {
    throw new Error('Empty response from server')
  }

  return response.data
}

export async function getAudioBlob(text: string): Promise<Blob> {
  const response = await chrome.runtime.sendMessage({
    type: MESSAGE_TYPES.GET_AUDIO,
    text,
  }) as BackgroundResponse<string>

  if (!response.success) {
    throw new Error(response.error ?? 'TTS failed')
  }

  if (!response.data) {
    throw new Error('Empty audio response')
  }

  const binaryString = atob(response.data)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return new Blob([bytes], { type: 'audio/mp3' })
}

export function stripHtml(html: string): string {
  const tmp = document.implementation.createHTMLDocument('').body
  tmp.innerHTML = html
  return tmp.textContent ?? ''
}

export function parseSearchResponse(response: NaverDictionaryResponse): ParsedWord[] {
  const words = response.searchResultMap.searchResultListMap.WORD.items

  return words.map((word) => {
    const means: ParsedMean[] = []

    for (const collector of word.meansCollector) {
      for (const mean of collector.means) {
        means.push({
          partOfSpeech: collector.partOfSpeech || null,
          value: stripHtml(mean.value),
        })
      }
    }

    const pinyinSymbol = word.searchPhoneticSymbolList[0]
    const pinyin = pinyinSymbol?.symbolValue ? stripHtml(pinyinSymbol.symbolValue) : null

    return {
      word: word.handleEntry,
      pinyin,
      link: word.destinationLinkKo || null,
      means,
      audioUrl: `https://learn.dict.naver.com/tts?speaker=zh_cn&service=today-conversation&domain=naver&from=mobile&speech_fmt=mp3&text=${encodeURIComponent(word.handleEntry)}`,
    }
  })
}

const CHINESE_REGEX = /^[\u4E00-\u9FA5]+$/

export function isChinese(text: string): boolean {
  return CHINESE_REGEX.test(text)
}
