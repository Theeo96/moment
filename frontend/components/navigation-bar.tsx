"use client"

import { Home, CameraIcon, Heart, User } from 'lucide-react'

interface NavigationBarProps {
  currentPage?: 'main' | 'upload' | 'treatment' | 'mypage' | 'none'
  onNavigateHome?: () => void
  onNavigateCamera?: () => void
  onNavigateFavorites?: () => void
  onNavigateProfile?: () => void
  // Original prop names for backward compatibility
  onNavigateToMain?: () => void
  onNavigateToUpload?: () => void
  onNavigateToTreatment?: () => void
  onNavigateToMyPage?: () => void
  onNavigateToSharing?: () => void;
}

export default function NavigationBar({
  currentPage = 'main',
  onNavigateHome,
  onNavigateCamera,
  onNavigateFavorites,
  onNavigateProfile,
  onNavigateToMain,
  onNavigateToUpload,
  onNavigateToTreatment,
  onNavigateToMyPage,
  onNavigateToSharing,
}: NavigationBarProps) {
  const handleNavigateMain = onNavigateHome || onNavigateToMain
  const handleNavigateUpload = onNavigateCamera || onNavigateToUpload
  const handleNavigateTreatment = onNavigateFavorites || onNavigateToTreatment
  const handleNavigateMyPage = onNavigateProfile || onNavigateToMyPage
  const handleNavigateSharing = onNavigateToSharing;

  return (
    <nav className="p-3 flex-shrink-0">
      <div className="flex justify-around items-center py-4 px-6 max-w-md mx-auto bg-card rounded-3xl shadow-lg border-2 border-[#6B4423]">
        <button 
          className="flex flex-col items-center gap-1 transition-opacity hover:opacity-70" 
          onClick={handleNavigateMain}
          aria-label="홈"
        >
          <Home 
            className="w-7 h-7 text-[#C86732]" 
            strokeWidth={2.5} 
            fill={currentPage === 'main' ? '#C86732' : 'none'}
          />
        </button>
        <button 
          className="flex flex-col items-center gap-1 transition-opacity hover:opacity-70" 
          onClick={handleNavigateUpload}
          aria-label="사진 촬영"
        >
          <CameraIcon 
            className="w-7 h-7 text-[#C86732]" 
            strokeWidth={2.5}
            fill={currentPage === 'upload' ? '#C86732' : 'none'}
          />
        </button>
        <button 
          className="flex flex-col items-center gap-1 transition-opacity hover:opacity-70" 
          onClick={handleNavigateTreatment}
          aria-label="트리트먼트"
        >
          <Heart 
            className="w-7 h-7 text-[#C86732]" 
            strokeWidth={2.5}
            fill={currentPage === 'treatment' ? '#C86732' : 'none'}
          />
        </button>
        <button 
          className="flex flex-col items-center gap-1 transition-opacity hover:opacity-70" 
          onClick={handleNavigateMyPage}
          aria-label="마이 페이지"
        >
          <User 
            className="w-7 h-7 text-[#C86732]" 
            strokeWidth={2.5}
            fill={currentPage === 'mypage' ? '#C86732' : 'none'}
          />
        </button>
      </div>
    </nav>
  )
}
