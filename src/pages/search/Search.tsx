import { useMemo } from 'react'
import { useSearch } from '@/hooks/useSearch'
import { Volume2, ExternalLink, Book } from 'lucide-react'

export function Search() {
  const query = useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('search')
  }, [])

  const { words, isLoading, error, playAudio } = useSearch(query)

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-duo-green"></div>
        <div className="text-duo-gray-text font-bold animate-pulse">검색 중...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 gap-3 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-2">
           <span className="text-3xl">😢</span>
        </div>
        <div className="text-duo-red font-bold text-lg">오류 발생</div>
        <div className="text-duo-text text-sm">{error}</div>
      </div>
    )
  }

  if (words.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 gap-3 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2">
           <span className="text-3xl">🤔</span>
        </div>
        <div className="text-duo-gray-text font-bold">검색 결과가 없어요</div>
      </div>
    )
  }

  return (
    <div className="p-3 font-sans bg-white min-h-full">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-lg font-extrabold text-duo-green tracking-wide">도토리 중국어사전</h1>
        <a
          href={chrome.runtime.getURL('src/pages/options/index.html')}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-bold text-duo-blue hover:bg-sky-50 transition-colors text-sm"
        >
          <Book className="w-4 h-4" />
          단어장
        </a>
      </div>
      <ul className="space-y-4">
        {words.map((word, index) => (
          <li key={index} className="duo-card p-4 border-2 border-duo-gray hover:border-duo-blue transition-colors">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2 flex-wrap">
                  {word.link ? (
                    <a
                      href={word.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-2xl font-extrabold text-duo-text hover:text-duo-blue transition-colors flex items-center gap-1 group"
                    >
                      {word.word}
                      <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-duo-blue" />
                    </a>
                  ) : (
                    <span className="text-2xl font-extrabold text-duo-text">{word.word}</span>
                  )}
                  {word.pinyin && (
                    <span className="text-duo-gray-text text-lg font-serif">[{word.pinyin}]</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => { void playAudio(word.word) }}
                className="flex-shrink-0 w-10 h-10 rounded-xl bg-duo-blue text-white flex items-center justify-center border-b-4 border-duo-blue-dark active:border-b-0 active:translate-y-1 transition-all hover:bg-[#2DD0F8]"
                aria-label="발음 듣기"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
            
            <ul className="space-y-2">
              {word.means.map((mean, meanIndex) => (
                <li key={meanIndex} className="flex gap-3 text-sm">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-duo-gray/30 text-duo-gray-text font-bold flex items-center justify-center text-xs mt-0.5">
                    {meanIndex + 1}
                  </span>
                  <div className="flex-1">
                    {mean.partOfSpeech && (
                      <span className="inline-block px-2 py-0.5 mr-2 text-xs font-bold text-duo-blue bg-blue-50 rounded-lg border border-blue-100 uppercase tracking-wide">
                        {mean.partOfSpeech}
                      </span>
                    )}
                    <span className="text-duo-text leading-relaxed font-medium">{mean.value}</span>
                  </div>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}
