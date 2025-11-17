"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

interface SignupPageProps {
  onSignup: (profile: any) => void
  onSkip: () => void
}

export default function SignupPage({ onSignup, onSkip }: SignupPageProps) {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login")
  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (activeTab === "login") {
      if (!email || !password) {
        alert("모든 필드를 입력해주세요.")
        return
      }
    } else {
      if (!name || !age || !email) {
        alert("모든 필드를 입력해주세요.")
        return
      }
    }

    setIsLoading(true)
    setTimeout(() => {
      const profile = { name, age: Number.parseInt(age), email }
      onSignup(profile)
      setIsLoading(false)
    }, 800)
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold mb-2 font-serif">moment</h1>
        <p className="text-base" style={{ color: "#8B7355" }}>마음 건강 관리의 시작</p>
      </div>

      {/* Main Card */}
      <Card className="w-full max-w-md border-0 rounded-3xl bg-card shadow-xl h-8/12">
        <CardContent className="p-6 mx-0 my-1 px-4 py-0">
          <form onSubmit={handleSubmit} className="space-y-3">
            {activeTab === "login" ? (
              <>
                {/* Login Form */}
                <div className="text-center mb-1">
                  <h2 className="text-lg font-semibold py-[-px] text-chart-4">로그인 하기</h2>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">이메일</label>
                  <Input
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background border-border py-5 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">비밀번호</label>
                  <Input
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-background border-border py-5 rounded-xl"
                  />
                </div>
                <div className="pt-3">
                  <Button
                    type="submit"
                    className="w-full bg-[#C86732] hover:bg-[#C86732]/90 text-white py-5 rounded-xl text-base font-medium bg-[rgba(191,109,109,1)]"
                    disabled={isLoading}
                  >
                    {isLoading ? "처리 중..." : "로그인"}
                  </Button>
                </div>
                <div className="text-center pt-1 space-y-1.5">
                  <button
                    type="button"
                    className="text-sm text-muted-foreground hover:text-foreground block w-full"
                  >
                    비밀번호를 잊으셨나요?
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("signup")}
                    className="text-sm text-muted-foreground hover:text-foreground underline block w-full py-2.5"
                  >
                    회원가입 하러가기
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Signup Form */}
                <div className="text-center mb-1">
                  <h2 className="text-lg font-semibold text-chart-4">회원가입 하기</h2>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">이름</label>
                  <Input
                    type="text"
                    placeholder="홍길동"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-background border-border py-4 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">비밀번호</label>
                  <Input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-background border-border py-4 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">이메일</label>
                  <Input
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background border-border py-4 rounded-xl"
                  />
                </div>
                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full bg-[#C86732] hover:bg-[#C86732]/90 text-white py-5 rounded-xl text-base font-medium bg-[rgba(191,109,109,1)]"
                    disabled={isLoading}
                  >
                    {isLoading ? "처리 중..." : "가입하기"}
                  </Button>
                </div>
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab("login")}
                    className="text-sm text-muted-foreground hover:text-foreground underline"
                  >
                    로그인 하러가기
                  </button>
                </div>
              </>
            )}
          </form>
        </CardContent>
      </Card>

      <button
        type="button"
        onClick={onSkip}
        className="mt-4 text-sm text-muted-foreground hover:text-foreground underline"
      >
        로그인 없이 둘러보기
      </button>
    </div>
  )
}
