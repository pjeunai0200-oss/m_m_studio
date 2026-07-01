"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerClass = scrolled 
    ? "fixed top-0 w-full z-50 bg-white shadow-md transition-all duration-300"
    : "sticky top-0 w-full z-50 bg-white/80 backdrop-blur-md transition-all duration-300";

  return (
    <>
      <div className="relative z-[1001] bg-[#FFD166] text-[#1e293b] text-[13px] font-bold py-2 border-b-2 border-[#FFC436]">
        <div className="container flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>🎈 어른이들의 힐링 드럼 놀이터! 스트레스 타파 성인 전용 공간</span>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="hover:text-white transition-colors">이용 요금 💰</Link>
            <span className="text-black/20">|</span>
            <Link href="/contact" className="hover:text-white transition-colors">예약 문의 📞</Link>
          </div>
        </div>
      </div>

      <header className={headerClass}>
        <nav className="container h-[90px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-[#06D6A0] rounded-full flex items-center justify-center text-white text-2xl shadow-sm group-hover:animate-wiggle">
              🥁
            </div>
            <span className="font-display text-[28px] font-black text-[#118AB2] tracking-wide">
              뽀롱뽀롱<span className="text-[#EF476F]">스튜디오</span>
            </span>
          </Link>

          <ul className={`fixed inset-0 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center gap-8 transition-transform duration-400 ease-in-out md:static md:flex-row md:bg-transparent md:w-auto md:h-auto md:translate-x-0 ${menuOpen ? "translate-x-0" : "translate-x-full"}`}>
            <li><Link href="/rooms" className={`text-xl font-bold px-4 py-2 rounded-full hover:bg-[#F0FAFF] hover:text-[#118AB2] transition-colors ${pathname === "/rooms" ? "text-[#118AB2] bg-[#F0FAFF]" : "text-[#64748b]"}`} onClick={() => setMenuOpen(false)}>놀이 공간</Link></li>
            <li><Link href="/pricing" className={`text-xl font-bold px-4 py-2 rounded-full hover:bg-[#F0FAFF] hover:text-[#118AB2] transition-colors ${pathname === "/pricing" ? "text-[#118AB2] bg-[#F0FAFF]" : "text-[#64748b]"}`} onClick={() => setMenuOpen(false)}>이용 요금</Link></li>
            <li><Link href="/reviews" className={`text-xl font-bold px-4 py-2 rounded-full hover:bg-[#F0FAFF] hover:text-[#118AB2] transition-colors ${pathname === "/reviews" ? "text-[#118AB2] bg-[#F0FAFF]" : "text-[#64748b]"}`} onClick={() => setMenuOpen(false)}>이용 후기</Link></li>
            <li><Link href="/contact" className={`text-xl font-bold px-4 py-2 rounded-full hover:bg-[#F0FAFF] hover:text-[#118AB2] transition-colors ${pathname === "/contact" ? "text-[#118AB2] bg-[#F0FAFF]" : "text-[#64748b]"}`} onClick={() => setMenuOpen(false)}>문의하기</Link></li>
          </ul>

          <div className="flex items-center gap-4">
            <Link href="/pricing" className="hidden md:inline-flex btn btn-secondary py-3 px-6 text-lg">
              예약하기 🚀
            </Link>
            <button 
              className="md:hidden flex flex-col justify-center gap-[6px] w-8 h-8 z-50 relative"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="메뉴 열기"
            >
              <span className={`block w-8 h-[4px] rounded-full bg-[#118AB2] transition-transform ${menuOpen ? "rotate-45 translate-y-[10px]" : ""}`}></span>
              <span className={`block w-8 h-[4px] rounded-full bg-[#118AB2] transition-opacity ${menuOpen ? "opacity-0" : ""}`}></span>
              <span className={`block w-8 h-[4px] rounded-full bg-[#118AB2] transition-transform ${menuOpen ? "-rotate-45 -translate-y-[10px]" : ""}`}></span>
            </button>
          </div>
        </nav>
      </header>
    </>
  );
}
