import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "M.M.STUDIO | 프리미엄 드럼 스튜디오 & LP 라운지 — 인천 남동",
  description: "인천 남동구 프리미엄 드럼 스튜디오. 녹음, 합주, 레슨, LP 라운지.",
  openGraph: {
    title: "M.M.STUDIO | 프리미엄 드럼 스튜디오",
    description: "인천 남동구 음악인들의 아지트. 드럼 작업실, 개인 연습실, LP 라운지",
    url: "https://m-m-studio-six.vercel.app",
    siteName: "M.M.STUDIO",
    images: [
      {
        url: "/hero_drum_studio.png",
        width: 1200,
        height: 630,
        alt: "M.M.STUDIO 스튜디오 내부",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
};

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${cormorant.variable} ${outfit.variable}`}>
      <body className="antialiased font-body bg-black text-foreground flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
