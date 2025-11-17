"use client"

import { useState, useEffect } from "react"
import Splash from "@/components/splash"
import TutorialModal from "@/components/tutorial-modal"
import SignupPage from "@/components/signup-page"
import PrivacyConsentPage from "@/components/privacy-consent-page"
import ImageUploadPage from "@/components/image-upload-page"
import AnalysisLoadingPage from "@/components/analysis-loading-page"
import ResultsPage from "@/components/results-page"
import ResultSupportPage from "@/components/result-support-page"
import ProfessionalSearchPage from "@/components/professional-search-page"
import MainPage from "@/components/main-page"
import ErrorPage from "@/components/error-page"
import MyPage from "@/components/my-page"
import TreatmentPage from "@/components/treatment-page"
import SharingPage from "@/components/sharing-page" // Added sharing page import
import TermsPage from "@/components/Terms-page" // Added sharing page import

type AppState = "splash" | "tutorial" | "signup" | "privacy" | "upload" | "analysis" | "results" | "professional" | "main" | "error" | "mypage" | "treatment" | "sharing" | "Terms" // Added sharing state

export default function Home() {
  const [appState, setAppState] = useState<AppState>("splash")
  const [userProfile, setUserProfile] = useState<any>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [analysisResults, setAnalysisResults] = useState<any>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppState("tutorial")
    }, 2500)
    return () => clearTimeout(timer)
  }, [])

  const needsSupport = analysisResults?.status === 'support' || analysisResults?.neuroticism > 60

  return (
    <main className="min-h-screen bg-background">
      {appState === "splash" && <Splash />}
      {appState === "tutorial" && (
        <>
          <Splash />
          <TutorialModal
            onStartNow={() => setAppState("signup")}
            onLater={() => setAppState("main")}
          />
        </>
      )}
      {appState === "signup" && (
        <SignupPage
          onSignup={(profile) => {
            setUserProfile(profile)
            setAppState("privacy")
          }}
          onSkip={() => setAppState("main")}
        />
      )}
      {appState === "main" && (
        <MainPage
          userProfile={userProfile}
          onStartTest={() => setAppState("privacy")}
          onLogout={() => setAppState("mypage")}
          onNavigateToMain={() => setAppState("main")}
          onNavigateToPrivacy={() => setAppState("privacy")}
          onNavigateToHospital={() => setAppState("treatment")}
          onNavigateToTreatment={() => setAppState("treatment")}
          onNavigateToSharing={() => setAppState("sharing")} // Added sharing navigation handler
        />
      )}
      {appState === "mypage" && (
        <MyPage
          userProfile={userProfile}
          onBack={() => setAppState("main")}
          onNavigateToMain={() => setAppState("main")}
          onNavigateToUpload={() => setAppState("privacy")}
          onNavigateToTreatment={() => setAppState("treatment")}
          onNavigateToTerms={() => setAppState("Terms")}
        />
      )}
      {appState === "privacy" && (
        <PrivacyConsentPage
          onAgree={() => setAppState("upload")}
          onBack={() => setAppState("main")}
        />
      )}
      {appState === "upload" && (
        <ImageUploadPage
          onUpload={(data) => {
            setUploadedImage(data.image)
            setAnalysisResults(data.result)
            setAppState("analysis")
          }}
          onError={() => setAppState("upload")}
          onBack={() => setAppState("privacy")}
        />
      )}
      {appState === "analysis" && (
        <AnalysisLoadingPage
          onComplete={() => setAppState("results")}
          onSkip={() => setAppState("results")}
        />
      )}
      {appState === "results" && !needsSupport && (
        <ResultsPage
          results={analysisResults}
          onViewProfessionals={() => setAppState("professional")}
          onBack={() => setAppState("upload")}
          onNavigateToMain={() => setAppState("main")}
          onNavigateToUpload={() => setAppState("privacy")}
          onNavigateToTreatment={() => setAppState("treatment")}
          onNavigateToMyPage={() => setAppState("mypage")}
        />
      )}
      {appState === "results" && needsSupport && (
        <ResultSupportPage
          results={analysisResults}
          onBack={() => setAppState("upload")}
          onNavigateToMain={() => setAppState("main")}
          onNavigateToUpload={() => setAppState("privacy")}
          onNavigateToTreatment={() => setAppState("treatment")}
          onNavigateToMyPage={() => setAppState("mypage")}
        />
      )}
      {appState === "treatment" && (
        <TreatmentPage
          onBack={() => setAppState("main")}
          onNavigateToHospital={() => setAppState("professional")}
          onNavigateToMain={() => setAppState("main")}
          onNavigateToUpload={() => setAppState("privacy")}
          onNavigateToMyPage={() => setAppState("mypage")}
        />
      )}
      {appState === "professional" && (
        <ProfessionalSearchPage
          onBack={() => setAppState("main")}
          onNavigateToMain={() => setAppState("main")}
          onNavigateToUpload={() => setAppState("privacy")}
          onNavigateToTreatment={() => setAppState("treatment")}
          onNavigateToMyPage={() => setAppState("mypage")}
        />
      )}
      {appState === "sharing" && (
        <SharingPage
          onBack={() => setAppState("main")}
          onNavigateToMain={() => setAppState("main")}
          onNavigateToUpload={() => setAppState("privacy")}
          onNavigateToTreatment={() => setAppState("treatment")}
          onNavigateToMyPage={() => setAppState("mypage")}
        />
      )}
      {appState === "Terms" && (
        <TermsPage
          onBack={() => setAppState("mypage")}
        />
      )}
      {appState === "error" && (
        <ErrorPage
          onRetry={() => setAppState("analysis")}
          onBackToHome={() => setAppState("main")}
        />
      )}
    </main>
  )
}
