import type React from "react"
import type { Metadata } from "next"

import "./globals.css"
import { Noto_Sans_KR, Merriweather as V0_Font_Merriweather } from 'next/font/google'

// Initialize fonts
const _merriweather = V0_Font_Merriweather({ subsets: ['latin'], weight: ["300","400","500","600","700","800","900"] })

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "모멘트 - 모두를 위한 멘탈 트리트먼트",
  description: "5요인 기반의 신뢰성있는 심리 테스트, 그림 4장만으로 당신의 성격을 분석합니다.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKr.className} font-serif antialiased`}>{children}</body>
    </html>
  )
}
