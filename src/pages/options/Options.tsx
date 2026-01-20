import { useWordbook } from '@/hooks/useWordbook'
import { Trash2, Book, Loader2, AlertCircle } from 'lucide-react'
import { version } from '../../../package.json'

export function Options() {
  const { entries, isLoading, error, deleteEntry, clearAll } = useWordbook()

  const handleClearAll = async () => {
    if (window.confirm('모든 단어를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      await clearAll()
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('이 단어를 삭제하시겠습니까?')) {
      await deleteEntry(id)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex font-sans text-duo-text selection:bg-duo-green selection:text-white">
      {/* Sidebar - Duolingo Style */}
      <aside className="w-[256px] bg-white border-r-2 border-duo-gray fixed h-full flex flex-col z-10 hidden md:flex p-4">
        <div className="px-4 py-6 mb-4">
          <h1 className="font-extrabold text-2xl text-duo-green tracking-tight">도토리 중국어사전</h1>
        </div>
        <nav className="flex-1 space-y-2">
          <div
            className="w-full flex items-center gap-4 px-4 py-3 bg-blue-50 border-2 border-blue-200 text-duo-blue font-bold uppercase tracking-wider rounded-xl cursor-default"
          >
            <Book className="w-6 h-6" />
            단어장
          </div>
          {/* <div className="w-full flex items-center gap-4 px-4 py-3 text-duo-gray-text font-bold uppercase tracking-wider rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
            <Trophy className="w-6 h-6" />
            도전과제
          </div> */}
        </nav>
        <div className="p-4 border-t-2 border-duo-gray text-xs font-bold text-duo-gray-text uppercase tracking-widest text-center">
          Version {version}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-[256px] p-6 max-w-5xl mx-auto w-full">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-duo-gray pb-6">
            <div>
              <h2 className="text-3xl font-extrabold text-duo-text mb-2">나의 단어장</h2>
              <p className="text-duo-gray-text font-medium">저장된 단어를 복습하고 실력을 키우세요!</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white px-5 py-2.5 rounded-2xl border-2 border-duo-gray flex items-center gap-3 shadow-sm">
                <div className="w-3 h-3 rounded-full bg-duo-orange"></div>
                <span className="font-bold text-duo-text">
                  총 <span className="text-duo-green">{entries.length}</span>개 단어
                </span>
              </div>
              {entries.length > 0 && (
                <button
                  onClick={() => { void handleClearAll() }}
                  className="duo-btn-red px-4 py-2.5 text-sm flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  전체 삭제
                </button>
              )}
            </div>
          </header>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-duo-red px-6 py-4 rounded-2xl flex items-center gap-3 font-bold">
              <AlertCircle className="w-6 h-6" />
              {error}
            </div>
          )}

          {/* Content Area */}
          <div className="min-h-[400px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64 gap-4 text-duo-gray-text">
                <Loader2 className="w-10 h-10 animate-spin text-duo-blue" />
                <p className="font-bold text-lg">단어장을 불러오는 중...</p>
              </div>
            ) : entries.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-96 gap-6 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-2 animate-bounce">
                  <Book className="w-10 h-10 text-gray-300" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-duo-text mb-2">아직 저장된 단어가 없어요!</p>
                  <p className="text-duo-gray-text font-medium text-lg">단어를 검색하고 저장해서 나만의 단어장을 만들어보세요.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {entries.map((entry, index) => (
                  <div key={entry.id} className="duo-card relative group hover:border-duo-blue transition-colors duration-200">
                    <div className="flex flex-col md:flex-row gap-6">
                      
                      {/* Left: Word & Date */}
                      <div className="md:w-[20%] flex flex-col justify-between border-b md:border-b-0 md:border-r-2 border-duo-gray pb-4 md:pb-0 md:pr-4 border-dashed">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="bg-duo-green text-white text-xs font-extrabold px-2 py-1 rounded-lg">
                              #{entries.length - index}
                            </span>
                          </div>
                          <div className="font-extrabold text-3xl text-duo-blue break-words">
                            {entry.word.entry}
                          </div>
                          {entry.word.pinyin && (
                            <div className="text-duo-gray-text font-serif mt-1">
                              [{entry.word.pinyin}]
                            </div>
                          )}
                        </div>
                        <div className="text-xs font-bold text-duo-gray-text mt-4">
                          {entry.createdAt.toLocaleDateString()}
                        </div>
                      </div>

                      {/* Middle: Meanings */}
                      <div className="md:w-[40%] space-y-2">
                        {entry.means.map((mean) => (
                          <div key={mean.id} className="text-base leading-relaxed text-duo-text pl-2 border-l-4 border-duo-green/20">
                            {mean.partOfSpeech && (
                              <span className="inline-block px-2 py-0.5 rounded-lg bg-gray-100 text-duo-gray-text text-xs font-extrabold mr-2 uppercase tracking-wide">
                                {mean.partOfSpeech}
                              </span>
                            )}
                            <span className="font-medium">{mean.value}</span>
                          </div>
                        ))}
                        {entry.means.length === 0 && (
                          <div className="text-duo-gray-text text-sm italic">뜻이 없습니다.</div>
                        )}
                      </div>

                      {/* Right: Examples & Actions */}
                      <div className="md:w-[40%] flex flex-col justify-between">
                        <div className="space-y-3">
                          {entry.examples.length > 0 ? (
                            entry.examples.slice(0, 2).map((example) => (
                              <div key={example.id} className="bg-[#F7F7F7] p-3 rounded-xl border-2 border-transparent hover:border-duo-gray transition-colors">
                                <p className="text-duo-text font-bold text-sm mb-1">{example.exampleZh}</p>
                                {example.examplePinyin && (
                                  <p className="text-duo-gray-text text-xs font-serif mb-1">{example.examplePinyin}</p>
                                )}
                                {example.exampleKo && (
                                  <p className="text-duo-text/80 text-xs">{example.exampleKo}</p>
                                )}
                              </div>
                            ))
                          ) : (
                             <div className="text-duo-gray-text text-sm italic p-2">예문이 없습니다.</div>
                          )}
                        </div>

                        <div className="flex justify-end mt-4 pt-4 border-t-2 border-duo-gray/30 border-dashed">
                           <button
                             onClick={() => { void handleDelete(entry.id) }}
                             className="duo-btn-ghost text-duo-red hover:bg-red-50 px-4 py-2 flex items-center gap-2"
                           >
                             <Trash2 className="w-5 h-5" />
                             <span className="text-xs">삭제하기</span>
                           </button>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
