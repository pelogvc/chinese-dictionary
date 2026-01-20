import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Book } from 'lucide-react'

export function Popup() {
  const [word, setWord] = useState('')
  const [searchUrl, setSearchUrl] = useState<string | null>(null)

  const handleSubmit = useCallback(() => {
    if (!word.trim()) {
      alert('검색어를 입력해주세요.')
      return
    }
    const url = chrome.runtime.getURL(`src/pages/search/index.html?search=${encodeURIComponent(word.trim())}`)
    setSearchUrl(url)
  }, [word])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSubmit()
      }
    },
    [handleSubmit]
  )

  return (
    <div className="w-[330px] p-4 bg-white min-h-[150px]">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-extrabold text-duo-green tracking-wide">도토리 중국어사전</h1>
        <a
          href={chrome.runtime.getURL('src/pages/options/index.html')}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-duo-blue hover:bg-sky-50 transition-colors"
        >
          <Book className="w-5 h-5" />
          <span className="text-sm">단어장</span>
        </a>
      </div>

      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Input
            value={word}
            onChange={(e) => { setWord(e.target.value) }}
            onKeyDown={handleKeyDown}
            placeholder="단어 검색..."
            className="duo-input w-full pr-4 h-12"
          />
        </div>
        <Button 
          onClick={handleSubmit} 
          className="duo-btn-green h-12 px-4 shadow-none hover:shadow-none"
        >
          <Search className="w-6 h-6" />
        </Button>
      </div>

      {searchUrl && (
        <div className="rounded-2xl border-2 border-duo-gray overflow-hidden">
          <iframe
            src={searchUrl}
            className="w-full h-[300px]"
            title="검색 결과"
          />
        </div>
      )}
    </div>
  )
}
