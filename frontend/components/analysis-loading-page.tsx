"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

interface AnalysisLoadingPageProps {
  onComplete: () => void
  onSkip: () => void
}

export default function AnalysisLoadingPage({ onComplete }: AnalysisLoadingPageProps) {
  const [dots, setDots] = useState(0)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const dotTimer = setInterval(() => {
      setDots((prev) => (prev + 1) % 4)
    }, 500)

    const completeTimer = setTimeout(() => {
      setIsReady(true)
    }, 3000)

    return () => {
      clearInterval(dotTimer)
      clearTimeout(completeTimer)
    }
  }, [])

  const dotString = ".".repeat(dots)

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-between p-6">
      {/* Top Section - Logo and Title */}
      <div className="flex flex-col items-center justify-start pt-20">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            {/* Outer glow layers */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#B8D4B8]/30 to-[#E8A590]/30 blur-2xl scale-110"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#B8D4B8]/20 to-[#E8A590]/20 blur-xl scale-105"></div>
            
            {/* Main logo circle with refined gradient */}
            <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-[#B8D4B8] via-[#D4C4A8] to-[#E8A590] shadow-2xl">
              {/* Inner highlight for depth */}
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>
              
              {/* Letter M with refined styling */}
              <div className="relative text-white text-5xl font-bold tracking-tight drop-shadow-md" style={{ fontFamily: 'Georgia, serif' }}>
                M
              </div>
            </div>
            
            {/* Subtle bottom shadow for lift effect */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-8 w-24 rounded-full bg-primary/10 blur-xl"></div>
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2 text-[rgba(220,147,108,1)] font-serif">moment</h1>
      </div>

      {/* Center Section - Message and Loading */}
      <div className="flex flex-col items-center justify-center space-y-8 text-center">
        <div className="space-y-2">
          <p className="text-foreground italic font-serif text-lg">"Everyone 
deserves <br />mental health treatment.<br />
Now is your time.”</p>
        </div>

        {/* Loading Animation */}
        <div className="flex items-center justify-center gap-3">
          <div className="w-4 h-4 rounded-full bg-primary animate-pulse"></div>
          <div className="w-8 h-3 rounded-full bg-primary/60 animate-pulse" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-4 h-4 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: "0.4s" }}></div>
        </div>

        {!isReady ? (
          <p className="text-base text-muted-foreground">분석 중{dotString}</p>
        ) : (
          <p className="text-base text-primary font-semibold">분석 완료!</p>
        )}
      </div>

      <div className="w-full max-w-sm">
        {isReady && (
          <Button
            onClick={onComplete}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-6 text-lg rounded-full"
          >
            결과 확인하기
          </Button>
        )}
      </div>
    </div>
  )
}
