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

  // 홈 페이지 여부에 따라 투명 헤더 적용
  const isHome = pathname === "/";
  const headerClass = isHome && !scrolled 
    ? "fixed top-0 w-full z-50 bg-transparent transition-all duration-300 border-b border-transparent"
    : "sticky top-0 w-full z-50 bg-[#0a0a0ae6] backdrop-blur-md transition-all duration-300 border-b border-border";

  return (
    <>
      <div className="relative z-[1001] bg-dark2 text-muted text-[11px] tracking-[1px] py-[6px] border-b border-border">
        <div className="container flex justify-between items-center">
          <span>인천 부평구 드럼 스튜디오</span>
          <div className="flex items-center gap-3">
            <Link href="/pricing" className="hover:text-white transition-colors">대여 계산기</Link>
            <span className="text-[#444]">|</span>
            <Link href="/lp" className="hover:text-white transition-colors">LP 쇼룸</Link>
            <span className="text-[#444]">|</span>
            <Link href="/contact" className="hover:text-white transition-colors">예약 문의</Link>
          </div>
        </div>
      </div>

      <header className={headerClass}>
        <nav className="container h-[80px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-[26px] tracking-[1px] font-medium italic text-white flex items-center gap-[6px]">
              BEAT <span className="text-accent text-[22px]">&</span> VINYL
            </span>
          </Link>

          <ul className={`fixed inset-0 bg-black flex flex-col items-center justify-center gap-8 transition-transform duration-400 ease-in-out md:static md:flex-row md:bg-transparent md:w-auto md:h-auto md:translate-x-0 ${menuOpen ? "translate-x-0" : "translate-x-full"}`}>
            <li><Link href="/rooms" className={`text-sm tracking-[2px] font-medium relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-accent after:transition-all after:duration-300 hover:text-white ${pathname === "/rooms" ? "text-white after:w-full" : "text-muted after:w-0 hover:after:w-full"}`} onClick={() => setMenuOpen(false)}>THE ROOMS</Link></li>
            <li><Link href="/pricing" className={`text-sm tracking-[2px] font-medium relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-accent after:transition-all after:duration-300 hover:text-white ${pathname === "/pricing" ? "text-white after:w-full" : "text-muted after:w-0 hover:after:w-full"}`} onClick={() => setMenuOpen(false)}>PRICING</Link></li>
            <li><Link href="/lp" className={`text-sm tracking-[2px] font-medium relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-accent after:transition-all after:duration-300 hover:text-white ${pathname === "/lp" ? "text-white after:w-full" : "text-muted after:w-0 hover:after:w-full"}`} onClick={() => setMenuOpen(false)}>LP SHOWROOM</Link></li>
            <li><Link href="/contact" className={`text-sm tracking-[2px] font-medium relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-accent after:transition-all after:duration-300 hover:text-white ${pathname === "/contact" ? "text-white after:w-full" : "text-muted after:w-0 hover:after:w-full"}`} onClick={() => setMenuOpen(false)}>CONTACT</Link></li>
          </ul>

          <div className="flex items-center gap-4">
            <Link href="/pricing" className="hidden md:inline-flex btn btn-primary py-[10px] px-5 text-xs">
              BOOK NOW
            </Link>
            <button 
              className="md:hidden flex flex-col justify-center gap-[5px] w-6 h-6 z-50 relative"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="메뉴 열기"
            >
              <span className={`block w-6 h-[2px] bg-white transition-transform ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`}></span>
              <span className={`block w-6 h-[2px] bg-white transition-opacity ${menuOpen ? "opacity-0" : ""}`}></span>
              <span className={`block w-6 h-[2px] bg-white transition-transform ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`}></span>
            </button>
          </div>
        </nav>
      </header>
    </>
  );
}
