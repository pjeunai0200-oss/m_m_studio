import type { Metadata } from "next";
import { Jua, Baloo_2 } from "next/font/google";
import "./globals.css";

const jua = Jua({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "뽀롱뽀롱 스튜디오 | 신나는 드럼 놀이터",
  description: "인천 남동구 어른이들을 위한 신나는 드럼 놀이터! 맘껏 두드리며 스트레스를 날려버리세요.",
  openGraph: {
    title: "뽀롱뽀롱 스튜디오 | 신나는 드럼 놀이터",
    description: "인천 남동구 어른이들을 위한 신나는 드럼 놀이터! 맘껏 두드리며 스트레스를 날려버리세요.",
    url: "https://m-m-studio-six.vercel.app",
    siteName: "뽀롱뽀롱 스튜디오",
    images: [
      {
        url: "/adult_kidscafe_hero_1782866292142.png",
        width: 1200,
        height: 630,
        alt: "뽀롱뽀롱 스튜디오 내부",
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
    <html lang="ko" className={`${jua.variable} ${baloo.variable}`}>
      <body className="antialiased font-body bg-background text-foreground flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 overflow-hidden relative">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
