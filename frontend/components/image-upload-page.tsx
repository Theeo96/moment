"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, Upload, AlertCircle, Home, TreePine, User } from 'lucide-react'

interface ImageUploadPageProps {
  onUpload: (data: { image: string; category: number }) => void
  onError: () => void
  onBack: () => void
}

export default function ImageUploadPage({ onUpload, onError, onBack }: ImageUploadPageProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [hasError, setHasError] = useState(false)
  const [showDuplicateAlert, setShowDuplicateAlert] = useState(false)
  const [showSelection, setShowSelection] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getCategoryName = () => {
    if (selectedCategory === 0) return '집'
    if (selectedCategory === 1) return '나무'
    if (selectedCategory === 2) return '사람'
    return null
  }

  const getCategoryIcon = () => {
    if (selectedCategory === 0) return <Home className="w-6 h-6" />
    if (selectedCategory === 1) return <TreePine className="w-6 h-6" />
    if (selectedCategory === 2) return <User className="w-6 h-6" />
    return null
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setHasError(true)
      setUploadedImage(null)
      return
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      setHasError(true)
      setUploadedImage(null)
      return
    }

    setHasError(false)

    // Read file as base64
    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      setUploadedImage(result)
    }
    reader.readAsDataURL(file)
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleAnalyze = async () => {
    if (!uploadedImage || selectedCategory === null) return

    try {
      const formData = new FormData()
      
      // Convert base64 to blob
      const base64Response = await fetch(uploadedImage)
      const blob = await base64Response.blob()
      
      formData.append('image', blob, 'drawing.jpg')
      formData.append('category', selectedCategory.toString())

      console.log('[v0] Sending to backend - category:', selectedCategory)

      const response = await fetch('http://4.217.198.234:5678/', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Backend request failed')
      }

      const result = await response.json()
      console.log('[v0] Backend response:', result)

      // Pass both image and result to parent
      onUpload({ image: uploadedImage, category: selectedCategory, result })
    } catch (error) {
      console.error('[v0] Error sending to backend:', error)
      onError()
    }
  }

  const handleSelectCategory = (category: number) => {
    setSelectedCategory(category)
    setUploadedImage(null)
    setShowSelection(false)
  }

  const handleReopenSelection = () => {
    setShowSelection(true)
    setUploadedImage(null)
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-destructive">파일을 불러올 수 없습니다</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              파일이 손상되었거나 지원하지 않는 형식입니다.
            </p>
            <p className="text-xs text-muted-foreground text-center">
              파일 형식: JPG (10MB 이하)
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onBack}
                className="flex-1 text-foreground border-border hover:bg-muted bg-transparent"
              >
                뒤로가기
              </Button>
              <Button
                onClick={() => {
                  setHasError(false)
                  handleUploadClick()
                }}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                재시도
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gradient-to-b from-background to-muted flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="뒤로가기"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold text-chart-4">그림 업로드</h2>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-4 flex flex-col">
        <div className="mb-4 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            {getCategoryIcon() || <div className="text-2xl">🎨</div>}
          </div>
        </div>

        <h2 className="text-xl font-bold text-center text-foreground mb-1">
          {getCategoryName() ? `${getCategoryName()} 그리기` : '그림 업로드'}
        </h2>

        {getCategoryName() && (
          <p className="text-xs text-muted-foreground text-center mb-4">
            {selectedCategory === 0 && '문, 창문, 지붕을 포함해서 자유롭게 그려주세요'}
            {selectedCategory === 1 && '줄기, 가지, 뿌리를 포함해서 자유롭게 그려주세요'}
            {selectedCategory === 2 && '머리부터 발끝까지 전신을 그려주세요'}
          </p>
        )}

        {/* Upload Area */}
        <Card className="border-2 border-dashed border-border cursor-pointer transition-colors hover:border-primary hover:bg-primary/5 mb-4 bg-primary-foreground">
          <CardContent className="pt-4 pb-4">
            <div
              className="flex flex-col items-center justify-center h-32"
              onClick={handleUploadClick}
            >
              {uploadedImage ? (
                <div className="text-center w-full">
                  <img
                    src={uploadedImage || "/placeholder.svg"}
                    alt="업로드된 이미지"
                    className="w-20 h-20 object-cover rounded-lg mx-auto mb-1"
                  />
                  <p className="text-xs text-foreground font-medium">파일이 선택되었습니다</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">다시 클릭하여 변경</p>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium text-foreground mb-1">사진첩에서 가져오기</p>
                  <p className="text-xs text-muted-foreground">JPG 형식, 10MB 이하</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Info Text */}
        <p className="text-xs text-muted-foreground text-center mb-4">
          ※ 실물 종이에 그린 그림을 업로드하지 않을 경우<br/>
          검사 결과가 다르게 나올 수 있습니다.
        </p>

        <div className="text-center mb-4">
          <button
            onClick={handleReopenSelection}
            className="text-sm text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
          >
            다시 선택하기
          </button>
        </div>

        <div className="flex gap-3 mt-auto">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1 text-foreground border-border hover:bg-secondary bg-red-50"
          >
            뒤로가기
          </Button>
          <Button
            onClick={handleAnalyze}
            disabled={!uploadedImage || selectedCategory === null}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          >
            결과보기
          </Button>
        </div>
      </main>

      {showDuplicateAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-sm w-full border-0 shadow-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-center text-chart-4">
                중복된 이미지가 첨부되었습니다.
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setShowDuplicateAlert(false)}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                확인
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {showSelection && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full border-0 shadow-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-center text-chart-4" style={{ color: '#6B4423' }}>
                HTP 이미지 분석을 위해<br/>그림을 그려서 올려주세요<br/>(1가지 선택)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => handleSelectCategory(0)}
                className="w-full h-16 text-foreground border-2 flex items-center justify-center gap-3 bg-primary/10 hover:bg-primary/20 border-primary/20 hover:border-primary"
                variant="outline"
              >
                <Home className="w-6 h-6" />
                <span className="text-lg font-semibold">집</span>
              </Button>
              
              <Button
                onClick={() => handleSelectCategory(1)}
                className="w-full h-16 text-foreground border-2 flex items-center justify-center gap-3 bg-primary/10 hover:bg-primary/20 border-primary/20 hover:border-primary"
                variant="outline"
              >
                <TreePine className="w-6 h-6" />
                <span className="text-lg font-semibold">나무</span>
              </Button>
              
              <Button
                onClick={() => handleSelectCategory(2)}
                className="w-full h-16 text-foreground border-2 flex items-center justify-center gap-3 bg-primary/10 hover:bg-primary/20 border-primary/20 hover:border-primary"
                variant="outline"
              >
                <User className="w-6 h-6" />
                <span className="text-lg font-semibold">사람</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
