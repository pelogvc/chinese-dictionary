import { useState, useEffect, useCallback, useRef } from 'react'
import { searchWord, parseSearchResponse, getAudioBlob, stripHtml } from '@/lib/api'
import { addToWordbook } from '@/lib/db'
import type { ParsedWord, NaverDictionaryResponse } from '@/types/api'

interface UseSearchResult {
  words: ParsedWord[]
  isLoading: boolean
  error: string | null
  playAudio: (word: string) => Promise<void>
}

export function useSearch(query: string | null): UseSearchResult {
  const [words, setWords] = useState<ParsedWord[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!query) return

    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await searchWord(query)
        const parsed = parseSearchResponse(response)
        setWords(parsed)

        await saveToWordbook(query, response)
      } catch (err) {
        setError(err instanceof Error ? err.message : '검색 중 오류가 발생했습니다.')
        setWords([])
      } finally {
        setIsLoading(false)
      }
    }

    void fetchData()
  }, [query])

  const playAudio = useCallback(async (word: string) => {
    try {
      const blob = await getAudioBlob(word)
      const url = URL.createObjectURL(blob)

      if (audioRef.current) {
        audioRef.current.pause()
        URL.revokeObjectURL(audioRef.current.src)
      }

      const audio = new Audio(url)
      audioRef.current = audio
      await audio.play()
    } catch (err) {
      console.error('Audio playback failed:', err)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        URL.revokeObjectURL(audioRef.current.src)
      }
    }
  }, [])

  return { words, isLoading, error, playAudio }
}

async function saveToWordbook(query: string, response: NaverDictionaryResponse): Promise<void> {
  const wordItems = response.searchResultMap.searchResultListMap.WORD.items
  const exampleItems = response.searchResultMap.searchResultListMap.EXAMPLE?.items ?? []

  if (wordItems.length === 0) return

  const firstWord = wordItems[0]!
  const pinyinSymbol = firstWord.searchPhoneticSymbolList[0]

  const means: Array<{ partOfSpeech: string | null; value: string }> = []
  for (const collector of firstWord.meansCollector) {
    for (const mean of collector.means) {
      means.push({
        partOfSpeech: collector.partOfSpeech || null,
        value: stripHtml(mean.value),
      })
    }
  }

  const examples = exampleItems.slice(0, 5).map((item) => ({
    exampleZh: stripHtml(item.expExample1),
    examplePinyin: item.expExample1Pronun ? stripHtml(item.expExample1Pronun) : null,
    exampleKo: item.expExample2 ? stripHtml(item.expExample2) : null,
  }))

  await addToWordbook({
    query,
    entry: firstWord.handleEntry,
    pinyin: pinyinSymbol?.symbolValue ? stripHtml(pinyinSymbol.symbolValue) : null,
    link: firstWord.destinationLinkKo || null,
    means,
    examples,
  })
}
