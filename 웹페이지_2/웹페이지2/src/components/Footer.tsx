import Link from "next/link";
import { supabase } from "@/utils/supabase/client";

export default async function Footer() {
  // Graceful fallback if supabase is not yet configured with env vars
  let data = null;
  try {
    const res = await supabase.from("settings").select("*");
    data = res.data;
  } catch (e) {
    console.warn("Supabase not configured yet");
  }

  let insta = "#", kakao = "#", yt = "#";
  if (data) {
    data.forEach(d => {
      if(d.key === "instagram") insta = d.value;
      if(d.key === "kakao") kakao = d.value;
      if(d.key === "youtube") yt = d.value;
    });
  }

  return (
    <footer className="bg-[#1e293b] text-white mt-auto relative z-10 overflow-hidden">
      {/* Decorative top wave */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] transform rotate-180">
        <svg className="relative block w-[calc(100%+1.3px)] h-[40px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,118.17,192.27,104.5Z" className="fill-white"></path>
        </svg>
      </div>

      <div className="pt-24 pb-16">
        <div className="container grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <span className="font-display text-3xl font-black tracking-wide text-[#FFD166] block mb-4">뽀롱뽀롱 스튜디오</span>
            <p className="text-lg text-white/80 mb-2">어른이들을 위한 힐링 놀이터 🎈</p>
            <p className="text-sm text-white/50">인천 남동구 성인 드럼 연습실</p>
          </div>
          <div>
            <h4 className="text-lg font-bold text-[#06D6A0] mb-6">SPACES</h4>
            <ul className="flex flex-col gap-4 text-white/80">
              <li><Link href="/rooms" className="hover:text-[#FFD166] transition-colors">통통 드럼 놀이터</Link></li>
              <li><Link href="/rooms" className="hover:text-[#FFD166] transition-colors">랄랄라 노래방</Link></li>
              <li><Link href="/rooms" className="hover:text-[#FFD166] transition-colors">휴식 라운지</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold text-[#EF476F] mb-6">INFO</h4>
            <ul className="flex flex-col gap-4 text-white/80">
              <li><Link href="/pricing" className="hover:text-[#FFD166] transition-colors">이용 요금</Link></li>
              <li><Link href="/reviews" className="hover:text-[#FFD166] transition-colors">이용 후기</Link></li>
              <li><Link href="/contact" className="hover:text-[#FFD166] transition-colors">문의하기</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold text-[#118AB2] mb-6">FOLLOW US</h4>
            <ul className="flex flex-col gap-4 text-white/80">
              <li><a href={insta} target="_blank" rel="noreferrer" className="hover:text-[#FFD166] transition-colors">Instagram</a></li>
              <li><a href={kakao} target="_blank" rel="noreferrer" className="hover:text-[#FFD166] transition-colors">카카오채널</a></li>
              <li><a href={yt} target="_blank" rel="noreferrer" className="hover:text-[#FFD166] transition-colors">YouTube</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 bg-black/20">
        <div className="container flex flex-col md:flex-row justify-between items-center text-sm text-white/50">
          <p>© 2026 뽀롱뽀롱 스튜디오. All rights reserved.</p>
          <p className="mt-2 md:mt-0">인천광역시 남동구 | 개인정보처리방침 | <Link href="/admin" className="hover:text-white transition-colors">Admin</Link></p>
        </div>
      </div>
    </footer>
  );
}
