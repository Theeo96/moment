export default function Splash() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#FFF5F0] via-[#FFF8F3] to-[#FFE8DC]">
      <div className="text-center px-8">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl"></div>
          <div className="absolute bottom-32 right-16 h-40 w-40 rounded-full bg-accent/15 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-primary/5 blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <div className="mb-8 flex justify-center">
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
          {/* </CHANGE> */}

          <h1 className="mb-4 text-5xl font-bold text-primary tracking-tight">
            <span className="text-pretty font-serif">moment</span>
          </h1>

          <p className="text-balance text-xl font-medium mb-2 text-[rgba(191,109,109,1)] font-sans">
            모두를 위한 <br />멘탈 트리트먼트
          </p>

          <p className="text-base text-[rgba(191,109,109,1)]">당신의 마음을 그려보세요</p>

          <div className="mt-12 flex justify-center gap-3">
            <div className="h-3 w-3 rounded-full bg-primary/50 animate-pulse"></div>
            <div className="h-3 w-3 rounded-full bg-primary/70 animate-pulse" style={{ animationDelay: "0.2s" }}></div>
            <div className="h-3 w-3 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.4s" }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
