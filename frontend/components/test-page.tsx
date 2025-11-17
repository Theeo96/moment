"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface TestPageProps {
  onTestComplete: (results: any) => void
  onBack: () => void
}

export default function TestPage({ onTestComplete, onBack }: TestPageProps) {
  const [uploadedImage, setUploadedImage] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async () => {
    if (!uploadedImage) {
      alert("이미지를 업로드해주세요.")
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      const mockResults = {
        openness: Math.floor(Math.random() * 100),
        conscientiousness: Math.floor(Math.random() * 100),
        extraversion: Math.floor(Math.random() * 100),
        agreeableness: Math.floor(Math.random() * 100),
        neuroticism: Math.floor(Math.random() * 100),
        images: [uploadedImage],
      }
      onTestComplete(mockResults)
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-primary">HTP 성격 테스트</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div>
              <CardTitle className="text-xl">그림 업로드</CardTitle>
              <CardDescription>집, 나무, 사람이 포함된 1장의 그림을 업로드해주세요</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              {uploadedImage ? (
                <div className="space-y-4">
                  <img
                    src={uploadedImage || "/placeholder.svg"}
                    alt="Drawing"
                    className="max-h-64 mx-auto rounded-lg"
                  />
                  <label className="cursor-pointer">
                    <span className="text-sm text-primary hover:underline">다시 업로드</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <div className="text-muted-foreground mb-2">📸</div>
                  <p className="font-medium text-foreground mb-1">이미지를 여기에 드래그하거나 클릭하세요</p>
                  <p className="text-sm text-muted-foreground">JPG, PNG 형식 지원</p>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={onBack} className="flex-1 bg-transparent">
                돌아가기
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isLoading ? "분석 중..." : "분석하기"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
