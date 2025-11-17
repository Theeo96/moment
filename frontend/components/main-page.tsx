"use client"

import { Button } from "@/components/ui/button"
import { Camera, NotebookPenIcon, Search, Home, Heart } from 'lucide-react'
import NavigationBar from "@/components/navigation-bar"

interface MainPageProps {
  userProfile: any
  onStartTest: () => void
  onLogout: () => void
  onNavigateToMain?: () => void
  onNavigateToPrivacy?: () => void
  onNavigateToHospital?: () => void
  onNavigateToTreatment?: () => void
  onNavigateToSharing?: () => void // Added sharing navigation prop
}

export default function MainPage({ 
  userProfile, 
  onStartTest, 
  onLogout,
  onNavigateToMain,
  onNavigateToPrivacy,
  onNavigateToHospital,
  onNavigateToTreatment,
  onNavigateToSharing // Destructure sharing navigation
}: MainPageProps) {
  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <main className="flex-1 p-3 pb-0 flex flex-col">
        {/* Hero Card */}
        <div className="relative bg-card rounded-3xl p-6 shadow-lg border-2 border-[#6B4423] overflow-hidden">
          {/* Decorative stars */}
          <div className="absolute top-3 right-3 w-5 h-5">
            <svg className="w-full h-full" viewBox="0 0 20 20">
              <path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" fill="#6B4423" />
            </svg>
          </div>
          <div className="absolute top-1/2 left-3 w-5 h-5">
            <svg className="w-full h-full" viewBox="0 0 20 20">
              <path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" fill="#6B4423" />
            </svg>
          </div>
          <div className="absolute bottom-3 left-3 w-5 h-5">
            <svg className="w-full h-full" viewBox="0 0 20 20">
              <path className="bg-[rgba(240,227,227,1)]" d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" fill="#6B4423" />
            </svg>
          </div>

          <div className="text-center relative">
            {/* Camera Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#6B4423] rounded-full mb-4 bg-[rgba(191,108,108,1)]">
              <Camera className="w-8 h-8 text-white" strokeWidth={2} />
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-foreground mb-4 leading-relaxed">
              지금 나의 순간을<br />그림으로<br/>표현해보아요.
            </h2>

            {/* CTA Button */}
            <Button
              onClick={onStartTest}
              className="w-full bg-[#C86732] hover:bg-[#B85628] text-white text-base py-5 rounded-full font-medium"
            >
              테스트하러 가기 →
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          {/* My Records Card */}
          <div 
            className="bg-card rounded-3xl p-4 shadow-md cursor-pointer hover:shadow-lg transition-shadow"
            onClick={onNavigateToSharing}
          >
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#6B4423] rounded-full mb-3 bg-[rgba(191,108,108,1)]">
                <NotebookPenIcon className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">마음 나눔</h3>
              <p className="text-xs text-foreground/70 leading-relaxed">
                당신 마음의<br/>순간들을<br/>기록하고 나눠봐요
              </p>
            </div>
          </div>

          {/* Treatment Card */}
          <div 
            className="bg-card rounded-3xl p-4 shadow-md cursor-pointer hover:shadow-lg transition-shadow"
            onClick={onNavigateToTreatment}
          >
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#6B4423] rounded-full mb-3 bg-[rgba(191,108,108,1)]">
                <Heart className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">트리트먼트</h3>
              <p className="text-xs text-foreground/70 leading-relaxed">
                당신에게 <br/>더 좋은 대우를<br/>해주세요
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1" />
      </main>

      <NavigationBar
        currentPage="main"
        onNavigateToMain={onNavigateToMain}
        onNavigateToUpload={onNavigateToPrivacy}
        onNavigateToTreatment={onNavigateToTreatment} // Updated navigation prop
        onNavigateToMyPage={onLogout}
        onNavigateToSharing={onNavigateToSharing} // Added sharing navigation prop
      />
    </div>
  )
}
