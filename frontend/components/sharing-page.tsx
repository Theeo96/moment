"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, Heart, Send } from 'lucide-react'
import NavigationBar from "@/components/navigation-bar"

interface SharingPageProps {
  onBack: () => void
  onNavigateToMain?: () => void
  onNavigateToUpload?: () => void
  onNavigateToTreatment?: () => void
  onNavigateToMyPage?: () => void
}

interface Entry {
  id: number
  content: string
  date: string
  likes: number
}

export default function SharingPage({
  onBack,
  onNavigateToMain,
  onNavigateToUpload,
  onNavigateToTreatment,
  onNavigateToMyPage,
}: SharingPageProps) {
  const [isWriting, setIsWriting] = useState(false)
  const [newEntry, setNewEntry] = useState("")
  const [entries, setEntries] = useState<Entry[]>([
    {
      id: 1,
      content: "오늘은 따뜻한 햇살이 좋았어요. 작은 것에 감사하는 하루였습니다.",
      date: "2025.01.15",
      likes: 12,
    },
    {
      id: 2,
      content: "힘든 하루였지만 친구의 위로가 큰 힘이 되었어요. 함께 있어줘서 고마워.",
      date: "2025.01.14",
      likes: 8,
    },
  ])

  const handleSubmit = () => {
    if (newEntry.trim()) {
      const entry: Entry = {
        id: Date.now(),
        content: newEntry,
        date: new Date().toLocaleDateString('ko-KR', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit' 
        }).replace(/\. /g, '.').replace(/\.$/, ''),
        likes: 0,
      }
      setEntries([entry, ...entries])
      setNewEntry("")
      setIsWriting(false)
    }
  }

  const handleLike = (id: number) => {
    setEntries(entries.map(entry => 
      entry.id === id ? { ...entry, likes: entry.likes + 1 } : entry
    ))
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="flex items-center px-4 py-2">
          <button onClick={onBack} className="mr-3">
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-chart-4">마음 나눔</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 pb-20">
        {isWriting ? (
          <div className="bg-card rounded-2xl p-4 shadow-md mb-4">
            <h2 className="text-lg font-bold mb-3">오늘의 마음</h2>
            <Textarea
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              placeholder="오늘 당신의 마음을 자유롭게 표현해보세요..."
              className="min-h-[200px] mb-4 resize-none"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleSubmit}
                disabled={!newEntry.trim()}
                className="flex-1 bg-[#C86732] hover:bg-[#B85628] text-white"
              >
                <Send className="w-4 h-4 mr-2" />
                공유하기
              </Button>
              <Button
                onClick={() => {
                  setIsWriting(false)
                  setNewEntry("")
                }}
                variant="outline"
              >
                취소
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Entries List */}
            <div className="space-y-3 mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                다른 분들의 마음
              </h3>
              {entries.map((entry) => (
                <div key={entry.id} className="bg-card rounded-2xl p-4 shadow-sm">
                  <p className="text-sm leading-relaxed mb-3">{entry.content}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{entry.date}</span>
                    <button
                      onClick={() => handleLike(entry.id)}
                      className="flex items-center gap-1 hover:text-[#C86732] transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                      <span>{entry.likes}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={() => setIsWriting(true)}
              className="w-full bg-[#C86732] hover:bg-[#B85628] text-white"
            >
              마음 나누기 +
            </Button>
          </>
        )}
      </main>

      {/* Navigation Bar */}
      <NavigationBar
        currentPage="none"
        onNavigateToMain={onNavigateToMain}
        onNavigateToUpload={onNavigateToUpload}
        onNavigateToTreatment={onNavigateToTreatment}
        onNavigateToMyPage={onNavigateToMyPage}
      />
    </div>
  )
}
