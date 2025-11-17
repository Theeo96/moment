"use client"

import { Button } from "@/components/ui/button"
import { NewspaperIcon,Settings, Calendar, ChevronRight, ChevronLeft, Bell, HelpCircle, LogOut } from 'lucide-react'
import NavigationBar from "@/components/navigation-bar"

interface MyPageProps {
  userProfile?: any
  onBack: () => void
  onNavigateToMain?: () => void
  onNavigateToUpload?: () => void
  onNavigateToTreatment?: () => void
  onNavigateToTerms?:() => void
}

export default function MyPage({ 
  userProfile, 
  onBack,
  onNavigateToMain,
  onNavigateToUpload,
  onNavigateToTreatment,
  onNavigateToTerms
}: MyPageProps) {
  const testHistory = [
    { id: 1, date: "2025.01.10", status: "양호", statusColor: "bg-green-100 text-green-700" },
    { id: 2, date: "2025.01.07", status: "상담 권장", statusColor: "bg-orange-100 text-orange-700" },
  ]

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden relative">
      <header className="border-b border-border bg-card flex-shrink-0">
        <div className="max-w-2xl mx-auto px-4 py-2 flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="뒤로가기"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-chart-4">My page</h1>
        </div>
      </header>

      <div className="flex-1 p-3 overflow-y-auto pb-24">
        <div className="bg-card rounded-3xl p-3 shadow-md mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#C86732] rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">사용자님</h2>
              <p className="text-xs text-muted-foreground">
                {userProfile?.email || "example@email.com"}
              </p>
            </div>
          </div>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-card rounded-3xl p-3 shadow-md text-center">
            <div className="text-3xl font-bold text-[#C86732] mb-1">3</div>
            <p className="text-xs text-muted-foreground">총 검사 횟수</p>
          </div>
          <div className="bg-card rounded-3xl p-3 shadow-md text-center">
            <div className="text-3xl font-bold text-[#C86732] mb-1">30</div>
            <p className="text-xs text-muted-foreground">연속 방문일</p>
          </div>
        </div>

        {/* 검사 기록 섹션 */}
        <div className="mb-3 flex-shrink-0">
          <h3 className="text-sm font-bold text-foreground mb-2">검사 기록</h3>
          <div className="space-y-2">
            {testHistory.slice(0, 2).map((test) => (
              <div
                key={test.id}
                className="bg-card rounded-2xl p-2.5 shadow-md"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 bg-[#FFE5D9] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-[#C86732]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-foreground">심리 검사</h4>
                    <p className="text-xs text-muted-foreground">{test.date}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${test.statusColor} flex-shrink-0`}>
                    {test.status}
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 설정 섹션 */}
        <div className="flex-shrink-0">
          <h3 className="text-sm font-bold text-foreground mb-2">설정</h3>
          <div className="bg-card rounded-2xl shadow-md overflow-hidden">
            <button className="w-full flex items-center justify-between p-2.5 border-b border-border hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-foreground">알림 설정</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            
            <button className="w-full flex items-center justify-between p-2.5 border-b border-border hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-foreground">도움말</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            
            <button 
            onClick={onNavigateToTerms}
            className="w-full flex items-center justify-between p-2.5 border-b border-border hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2">
                <NewspaperIcon className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-foreground">약관</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            
            <button className="w-full flex items-center justify-between p-2.5 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2">
                <LogOut className="w-4 h-4 text-red-500" />
                <span className="text-xs text-red-500">로그아웃</span>
              </div>
              <ChevronRight className="w-4 h-4 text-red-500" />
            </button>
          </div>
        </div>
      </div>

      {/* NavigationBar component */}
      <div className="fixed bottom-0 left-0 right-0 bg-background">
        <NavigationBar
          currentPage="mypage"
          onNavigateToMain={onNavigateToMain}
          onNavigateToUpload={onNavigateToUpload}
          onNavigateToTreatment={onNavigateToTreatment}
          onNavigateToMyPage={onBack}
        />
      </div>
    </div>
  )
}
