"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChevronLeft, Search } from 'lucide-react'
import { useState } from "react"
import NavigationBar from "@/components/navigation-bar"

interface ProfessionalSearchPageProps {
  onBack: () => void
  onNavigateToMain?: () => void
  onNavigateToUpload?: () => void
  onNavigateToTreatment?: () => void
  onNavigateToMyPage?: () => void
}

export default function ProfessionalSearchPage({ 
  onBack,
  onNavigateToMain,
  onNavigateToUpload,
  onNavigateToTreatment,
  onNavigateToMyPage
}: ProfessionalSearchPageProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const professionals = [
    {
      name: "강남 마음 상담 센터",
      address: "서울시 강남구 테헤란로",
      phone: "02-XXXX-XXXX",
      rating: 4.8,
      specialties: ["심리 상담", "성격 분석"],
    },
    {
      name: "서초 정신건강 클리닉",
      address: "서울시 서초구 강남대로",
      phone: "02-XXXX-XXXX",
      rating: 4.7,
      specialties: ["심리 치료", "스트레스 관리"],
    },
    {
      name: "메디칼 정신 센터",
      address: "서울시 강남구 삼성동",
      phone: "02-XXXX-XXXX",
      rating: 4.9,
      specialties: ["심리 평가", "치료"],
    },
  ]

  const filteredProfessionals = professionals.filter((prof) =>
    prof.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prof.address.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b border-border bg-card flex-shrink-0">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="뒤로가기"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-foreground">전문기관 찾기</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-8 overflow-y-auto">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="text"
            placeholder="지역을 검색하세요 (예: 강남구, 서초구)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-base bg-[rgba(249,244,244,1)]"
          />
        </div>

        {filteredProfessionals.length === 0 ? (
          <Card className="border-0 shadow-md">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">검색 결과가 없습니다.</p>
              <p className="text-sm text-muted-foreground mt-2">다른 지역을 검색해보세요.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredProfessionals.map((prof, idx) => (
              <Card key={idx} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">{prof.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-yellow-500">★ {prof.rating}</span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>📍 {prof.address}</p>
                      <p>📞 {prof.phone}</p>
                    </div>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-2">
                      {prof.specialties.map((spec, specIdx) => (
                        <span
                          key={specIdx}
                          className="px-2.5 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent border-border hover:bg-muted text-foreground"
                      >
                        연락하기
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        상세보기
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Navigation Bar */}
      <NavigationBar
        currentPage="treatment"
        onNavigateToMain={onNavigateToMain}
        onNavigateToUpload={onNavigateToUpload}
        onNavigateToTreatment={onNavigateToTreatment}
        onNavigateToMyPage={onNavigateToMyPage}
      />
    </div>
  )
}
