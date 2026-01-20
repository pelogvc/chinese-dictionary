import { useState, useEffect, useCallback } from 'react'
import { getWordbook, deleteFromWordbook, clearWordbook, type WordbookEntryWithDetails } from '@/lib/db'

interface UseWordbookResult {
  entries: WordbookEntryWithDetails[]
  isLoading: boolean
  error: string | null
  deleteEntry: (id: string) => Promise<void>
  clearAll: () => Promise<void>
  refresh: () => Promise<void>
}

export function useWordbook(): UseWordbookResult {
  const [entries, setEntries] = useState<WordbookEntryWithDetails[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEntries = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await getWordbook()
      setEntries(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '단어장을 불러오는 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchEntries()
  }, [fetchEntries])

  const deleteEntry = useCallback(async (id: string) => {
    try {
      await deleteFromWordbook(id)
      setEntries((prev) => prev.filter((entry) => entry.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : '삭제 중 오류가 발생했습니다.')
    }
  }, [])

  const clearAll = useCallback(async () => {
    try {
      await clearWordbook()
      setEntries([])
    } catch (err) {
      setError(err instanceof Error ? err.message : '전체 삭제 중 오류가 발생했습니다.')
    }
  }, [])

  return {
    entries,
    isLoading,
    error,
    deleteEntry,
    clearAll,
    refresh: fetchEntries,
  }
}
