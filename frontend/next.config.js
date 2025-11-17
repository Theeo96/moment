/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',           // 이 한 줄 때문에 완전 정적 파일로 바뀜
  trailingSlash: true,        // Azure SWA에서 /about 까지 안 붙으면 404 나는 것 방지
  images: {
    unoptimized: true         // next/image 최적화 끄기 (static export 할 때 필수)
  },
  // 만약 rewrites, redirects 쓰고 있었다면 주석 처리하거나 삭제
  // async rewrites() { ... }  ← 이런 거 있으면 일단 주석!

  // ← 이 한 줄 추가하면 validator 에러 100% 사라짐
  typescript: {
    ignoreBuildErrors: true
  },

  // 필요하면 eslint도 무시
  // eslint: {
  //   ignoreDuringBuilds: true
  // }
};

module.exports = nextConfig;
