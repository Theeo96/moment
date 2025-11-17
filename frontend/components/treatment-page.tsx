"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, Music, Coffee, Heart } from 'lucide-react'
import NavigationBar from "@/components/navigation-bar"

interface TreatmentPageProps {
  onBack: () => void
  onNavigateToHospital: () => void
  onNavigateToMain?: () => void
  onNavigateToUpload?: () => void
  onNavigateToMyPage?: () => void
}

export default function TreatmentPage({ 
  onBack, 
  onNavigateToHospital,
  onNavigateToMain,
  onNavigateToUpload,
  onNavigateToMyPage
}: TreatmentPageProps) {
  const treatments = [
    {
      icon: Music,
      title: "나를 위한 음악",
      description: "마음을 편안하게 하는 음악",
      color: "bg-blue-100"
    },
    {
      icon: Coffee,
      title: "오늘의 차 추천",
      description: "기분에 따른 차와 함께 휴식",
      color: "bg-orange-100"
    }
  ]

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="flex items-center px-4 py-2">
          <button onClick={onBack} className="mr-3">
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-chart-4">트리트먼트</h1>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-4 flex flex-col overflow-y-auto">
        {/* Title Section */}
        <div className="text-center mb-3">
          <h1 className="font-bold text-foreground mb-2 text-base">잠시 쉬어가세요</h1>
          <p className="text-sm text-muted-foreground">
            마음이 힘들때까지는 시간을 가져보세요
          </p>
        </div>

        {/* Treatment Cards Grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {treatments.map((treatment, idx) => (
            <Card key={idx} className="border-2 border-border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-2 flex flex-col items-center text-center">
                <div className={`inline-flex items-center justify-center w-10 h-10 ${treatment.color} rounded-2xl mb-1.5`}>
                  <treatment.icon className="w-5 h-5 text-foreground/80" strokeWidth={2} />
                </div>
                <h3 className="text-[11px] font-bold text-foreground mb-1 leading-tight">
                  {treatment.title}
                </h3>
                <p className="text-[9px] text-muted-foreground leading-snug">
                  {treatment.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Professional Help Card */}
        <Card className="border-2 border-[#C86732] bg-secondary/10">
          <CardContent className="p-5">
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#C86732]/10 rounded-full mb-3">
                <Heart className="w-6 h-6 text-[#C86732]" strokeWidth={2} />
              </div>
              <h3 className="text-base font-bold text-foreground mb-3">
                전문가의 도움이 필요한가요?
              </h3>
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                마음이 피곤하시거나 다소 힘드신 분들을 위해
                주변 상담센터나 커뮤니티, 병원 등을
                매칭해드리는 모멘트만의 서비스입니다
              </p>
              <Button 
                onClick={onNavigateToHospital}
                className="w-full bg-[#C86732] hover:bg-[#B85628] text-white rounded-full py-3 text-sm font-semibold"
              >
                전문가 찾기
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <NavigationBar
        currentPage="treatment"
        onNavigateToMain={onNavigateToMain}
        onNavigateToUpload={onNavigateToUpload}
        onNavigateToTreatment={onBack}
        onNavigateToMyPage={onNavigateToMyPage}
      />
    </div>
  )
}
