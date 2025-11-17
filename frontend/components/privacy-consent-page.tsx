"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface PrivacyConsentPageProps {
  onAgree: () => void
  onBack: () => void
}

export default function PrivacyConsentPage({ onAgree, onBack }: PrivacyConsentPageProps) {
  const [isAgreed, setIsAgreed] = useState(false)
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
        const hasScroll = scrollHeight > clientHeight
        if (!hasScroll) {
          setHasScrolledToBottom(true)
        } else {
          const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5
          if (isAtBottom) {
            setHasScrolledToBottom(true)
          }
        }
      }
    }

    const scrollElement = scrollRef.current
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll)
      setTimeout(handleScroll, 100)
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (hasScrolledToBottom) {
      setIsAgreed(e.target.checked)
    }
  }

  const handleTestClick = () => {
    if (isAgreed) {
      onAgree()
    }
  }

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-b from-background to-muted flex flex-col">
      <header className="border-b border-border bg-card flex-shrink-0">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="뒤로가기"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-chart-4">테스트 전 안내 사항</h1>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto px-4 py-4 w-full flex flex-col overflow-hidden">
        <div className="mb-4 flex justify-center flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-base font-bold">
              i
            </div>
          </div>
        </div>

        <Card className="border-0 shadow-lg flex-1 flex flex-col overflow-hidden">
          <CardHeader className="flex-shrink-0 pb-3">
            <CardTitle className="text-base text-center" style={{ color: '#6B4423' }}>개인정보 수집 동의</CardTitle>
            <p className="text-xs text-center text-muted-foreground mt-1">
              안내사항을 읽고 확인 후<br/>평가를 시작할 수 있습니다.
            </p>
          </CardHeader>
          
          <CardContent ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-0 my-0">
            <div className="space-y-3">
              <div className="bg-secondary/5 border border-border rounded-lg p-3">
                <p className="text-xs text-foreground leading-relaxed">
                  <strong>정보 보호 약속:</strong> 수집된 모든 정보는 안전하게 관리되며, 평가 목적으로만 사용됩니다.
                  귀하의 개인정보는 제3자와 공유되지 않습니다.
                </p>
              </div>

              <div className="bg-secondary/5 border border-border rounded-lg p-3">
                <p className="text-xs text-foreground leading-relaxed">
                  <strong>결과 활용:</strong> 평가 결과를 바탕으로 맞춤형 조언과 전문 기관 추천을 제공하며, 일반적인
                  통계 분석을 위해 비식별 처리된 데이터만 사용됩니다.
                </p>
              </div>

              <div className="bg-secondary/5 border border-border rounded-lg p-3">
                <p className="text-xs text-foreground leading-relaxed">
                  <strong>선택사항:</strong> 동의는 자발적이며, 진행 중 언제든지 중단할 수 있습니다. 동의하지 않으셔도
                  서비스 이용에 지장이 없습니다.
                </p>
              </div>

              <div className="bg-secondary/5 border border-border rounded-lg p-3">
                <p className="text-xs text-foreground leading-relaxed">
                  본 서비스에 의해 제공된 정보를 이용, 공유 또는 해석하거나 적용하는 등에 있어 생길 수 있는 모든 손해에 대해서 모멘트는 책임을 부담하지 않습니다.
                </p>
              </div>
            </div>
          </CardContent>
          
          <div className="border-t border-border px-4 py-3 flex-shrink-0">
            <div className="flex items-start justify-center gap-3 mb-3">
              <input
                type="checkbox"
                id="privacy-agree"
                checked={isAgreed}
                onChange={handleCheckboxChange}
                disabled={!hasScrolledToBottom}
                className="w-4 h-4 rounded border-2 border-primary text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0 cursor-pointer mt-0.5 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ accentColor: 'hsl(var(--primary))' }}
              />
              <label htmlFor="privacy-agree" className={hasScrolledToBottom ? "cursor-pointer" : "cursor-not-allowed opacity-50"}>
                <div className="flex flex-col">
                  <p className="text-xs font-medium text-foreground">
                    위 내용에 동의합니다.
                  </p>
                  {!hasScrolledToBottom && (
                    <span className="text-xs text-muted-foreground">
                      (아래로 스크롤해주세요)
                    </span>
                  )}
                </div>
              </label>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onBack}
                className="flex-1 text-foreground border-border hover:bg-secondary bg-transparent text-sm py-2"
              >
                거절하기
              </Button>
              <Button
                onClick={handleTestClick}
                disabled={!isAgreed}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm py-2"
              >
                테스트하기
              </Button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}
