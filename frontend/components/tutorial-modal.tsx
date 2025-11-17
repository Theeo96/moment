"use client"

import { useState } from "react"
import { ChevronRight, ChevronLeft } from 'lucide-react'

interface TutorialModalProps {
  onStartNow: () => void
  onLater: () => void
}

const tutorialSteps = [
  {
    title: "반가워요!",
    description: (
      <>
        나의 마음, 나의 성격<br />
        더 알아보고 싶으세요?
      </>
    ),
    icon: "👋",
  },
  {
    title: "1장의 그림 ",
    description:(
      <>
        집, 나무, 사람 그림을 그려<br />
        이미지 파일로 올려주세요.
      </>
    ),
    icon: "🖼️",
  },
  {
    title: "AI 빅데이터 분석 ",
    description:(
      <>
        검증된 데이터와 이론으로<br />
        나에 대하여 이해할 수 있어요.
      </>
    ),
    icon: "🤖",
  },
]

export default function TutorialModal({ onStartNow, onLater }: TutorialModalProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const step = tutorialSteps[currentStep]
  const isLastStep = currentStep === tutorialSteps.length - 1

  return (
    <div className="fixed inset-0 z-50 flex bg-transparent pb-8 items-end justify-center">
      <div className="max-w-sm rounded-2xl p-5 shadow-lg mx-4 bg-primary-foreground leading-7 w-full h-auto relative">
        <button
          onClick={onLater}
          className="absolute top-4 right-4 text-sm text-muted-foreground hover:text-foreground transition-colors underline"
          aria-label="건너뛰기"
        >
          건너뛰기
        </button>

        {/* Header */}
        <div className="mb-5 text-center">
          <div className="mb-3 text-3xl">{step.icon}</div>
          <h2 className="text-xl font-bold text-card-foreground">{step.title}</h2>
        </div>

        {/* Content */}
        <div className="mb-5">
          <p className="text-center text-sm leading-relaxed text-muted-foreground">{step.description}</p>
        </div>

        {/* Progress dots */}
        <div className="mb-5 flex justify-center gap-2">
          {tutorialSteps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`h-2 rounded-full transition-all bg-[rgba(191,109,109,1)] ${
                index === currentStep ? "w-8 bg-primary" : "w-2 bg-border hover:bg-muted"
              }`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>

        {/* Navigation and Action Buttons */}
        <div className="flex gap-3 justify-center">
          {currentStep > 0 && (
            <button
              onClick={handlePrev}
              className="flex items-center justify-center gap-1 rounded-lg px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 flex-1 bg-[rgba(191,109,109,1)]"
            >
              <ChevronLeft className="h-4 w-4" />
              이전
            </button>
          )}
          {!isLastStep ? (
            <button
              onClick={handleNext}
              className="flex items-center justify-center gap-1 rounded-lg px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 flex-1 bg-[rgba(191,109,109,1)]"
            >
              다음
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={onLater}
              className="flex items-center justify-center gap-1 rounded-lg px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 flex-1 bg-[rgba(191,109,109,1)]"
            >
              둘러보기
            </button>
          )}
        </div>

        {/* Call to Action */}
        {isLastStep && (
          <button
            onClick={onStartNow}
            className="mt-3 w-full rounded-lg px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 bg-[rgba(191,109,109,1)]"
          >
            로그인/회원가입
          </button>
        )}

        {/* Step Counter */}
        <div className="mt-3 text-center text-xs text-muted-foreground">
          {currentStep + 1} / {tutorialSteps.length}
        </div>
      </div>
    </div>
  )
}
