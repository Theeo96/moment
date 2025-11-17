"use client"

import { Button } from "@/components/ui/button"
import { AlertCircle } from 'lucide-react'

interface ErrorPageProps {
  onRetry: () => void
  onBackToHome: () => void
  errorMessage?: string
}

export default function ErrorPage({ onRetry, onBackToHome, errorMessage }: ErrorPageProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-12 h-12 text-destructive" strokeWidth={2} />
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-foreground">
            오류가 발생했습니다
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {errorMessage || "분석 중 문제가 발생했습니다.\n잠시 후 다시 시도해주세요."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <Button
            onClick={onRetry}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
          >
            다시 시도하기
          </Button>
          <Button
            onClick={onBackToHome}
            variant="outline"
            className="w-full"
            size="lg"
          >
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    </div>
  )
}
