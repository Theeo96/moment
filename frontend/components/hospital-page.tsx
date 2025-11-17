"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'
import { useState } from "react"

interface HospitalPageProps {
  results: any
  onBack: () => void
}

export default function HospitalPage({ results, onBack }: HospitalPageProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const centers = [
    {
      name: "강남 정신건강 센터",
      location: "서울시 강남구 테헤란로 123",
      phone: "02-1234-5678",
      specialty: ["성격 분석", "심리 상담", "스트레스 관리"],
      rating: 4.8,
      distance: "1.2km",
    },
    {
      name: "서초 마음 클리닉",
      location: "서울시 서초구 강남대로 456",
      phone: "02-9876-5432",
      specialty: ["성격 분석", "심리 상담", "인지행동치료"],
      rating: 4.7,
      distance: "2.1km",
    },
    {
      name: "메디칼 정신 센터",
      location: "서울시 강남구 삼성동 789",
      phone: "02-5555-7777",
      specialty: ["심리 평가", "심리 상담", "약물 치료"],
      rating: 4.9,
      distance: "1.8km",
    },
    {
      name: "미래 정신건강 센터",
      location: "서울시 서초구 반포대로 321",
      phone: "02-4444-8888",
      specialty: ["스트레스 관리", "심리 치료", "명상"],
      rating: 4.6,
      distance: "2.5km",
    },
  ]

  const filteredCenters = centers.filter((center) =>
    center.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    center.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-primary">전문 기관 추천</h1>
          <p className="text-sm text-muted-foreground mt-1">
            당신의 성격 분석 결과를 바탕으로 추천된 전문 상담 기관입니다.
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="text"
            placeholder="지역을 검색하세요 (예: 강남구, 서초구)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>

        {filteredCenters.length === 0 ? (
          <Card className="border-0 shadow-md">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">검색 결과가 없습니다.</p>
              <p className="text-sm text-muted-foreground mt-2">다른 지역을 검색해보세요.</p>
            </CardContent>
          </Card>
        ) : (
          filteredCenters.map((center, idx) => (
            <Card key={idx} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground">{center.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-yellow-500">★ {center.rating}</span>
                        <span className="text-sm text-muted-foreground">({center.distance})</span>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">📍 주소:</span> {center.location}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">📞 전화:</span> {center.phone}
                    </p>
                  </div>

                  {/* Specialties */}
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">전문 분야</p>
                    <div className="flex flex-wrap gap-2">
                      {center.specialty.map((spec, specIdx) => (
                        <span
                          key={specIdx}
                          className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      웹사이트 방문
                    </Button>
                    <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                      예약하기
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}

        {/* Important Notice */}
        <Card className="border-0 shadow-md bg-secondary/5">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-foreground">중요한 안내</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              본 테스트는 성격 분석 검사일 뿐이며, 더 자세한 상담은 전문가와 함께하시기 바랍니다. 위 센터들은
              참고용이며, 실제 센터 정보는 각 기관에 직접 문의하시기 바랍니다.
            </p>
          </CardContent>
        </Card>

        {/* Back Button */}
        <Button onClick={onBack} variant="outline" className="w-full bg-transparent">
          돌아가기
        </Button>
      </main>
    </div>
  )
}
