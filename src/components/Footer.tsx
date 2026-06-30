import Link from "next/link";
import { supabase } from "@/utils/supabase/client";

export default async function Footer() {
  const { data } = await supabase.from("settings").select("*");
  let insta = "#", kakao = "#", yt = "#";
  data?.forEach(d => {
    if(d.key === "instagram") insta = d.value;
    if(d.key === "kakao") kakao = d.value;
    if(d.key === "youtube") yt = d.value;
  });

  return (
    <footer className="bg-dark2 border-t border-border mt-auto relative z-10">
      <div className="pt-20 pb-16">
        <div className="container grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <span className="font-display text-2xl italic tracking-wide text-white block mb-4">M.M.STUDIO</span>
            <p className="text-sm text-muted mb-2">음악인들의 아지트 — 인천 남동구</p>
            <p className="text-xs text-[#555]">사업자등록번호: 000-00-00000 | 대표: 홍길동</p>
          </div>
          <div>
            <h4 className="text-xs font-medium tracking-[2px] text-white mb-6 uppercase">SPACES</h4>
            <ul className="flex flex-col gap-3 text-sm text-muted">
              <li><Link href="/rooms" className="hover:text-accent transition-colors">드럼 작업실</Link></li>
              <li><Link href="/rooms" className="hover:text-accent transition-colors">개인 연습실</Link></li>
              <li><Link href="/rooms" className="hover:text-accent transition-colors">LP 라운지</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-medium tracking-[2px] text-white mb-6 uppercase">INFO</h4>
            <ul className="flex flex-col gap-3 text-sm text-muted">
              <li><Link href="/pricing" className="hover:text-accent transition-colors">대여 요금</Link></li>
              <li><Link href="/lp" className="hover:text-accent transition-colors">LP 쇼룸</Link></li>
              <li><Link href="/contact" className="hover:text-accent transition-colors">예약 문의</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-medium tracking-[2px] text-white mb-6 uppercase">FOLLOW</h4>
            <ul className="flex flex-col gap-3 text-sm text-muted">
              <li><a href={insta} target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">Instagram</a></li>
              <li><a href={kakao} target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">카카오채널</a></li>
              <li><a href={yt} target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">YouTube</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-6">
        <div className="container flex flex-col md:flex-row justify-between items-center text-xs text-[#555]">
          <p>© 2026 M.M.STUDIO. All rights reserved.</p>
          <p className="mt-2 md:mt-0">인천광역시 남동구 | 개인정보처리방침 | <Link href="/admin" className="hover:text-white transition-colors">Admin</Link></p>
        </div>
      </div>
    </footer>
  );
}
