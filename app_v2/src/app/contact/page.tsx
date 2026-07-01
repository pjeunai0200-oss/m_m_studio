"use client";

import Link from "next/link";

export default function ContactPage() {
  return (
    <>
      <div className="page-header-band">
        <div className="container">
          <span className="eyebrow">CONTACT & BOOK</span>
          <h1 className="giant-title">문의 / 예약</h1>
          <p className="page-header-desc">첫 방문 시 <strong>30분 무료 체험</strong>을 제공해드립니다.</p>
        </div>
      </div>

      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <div className="max-w-[800px] mx-auto text-center">
            
            <div className="bg-[#F0FAFF] p-10 md:p-16 rounded-3xl shadow-lg border-4 border-white transform hover:-translate-y-2 transition-transform duration-300">
              <span className="text-6xl mb-6 block animate-bounce">📞</span>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-8">무엇이든 물어보세요!</h2>
              
              <div className="flex flex-col gap-8 text-left max-w-[400px] mx-auto bg-white p-8 rounded-2xl shadow-sm">
                <div>
                  <span className="block text-black text-[14px] tracking-[2px] mb-2 uppercase font-bold text-primary">📍 위치</span>
                  <span className="text-[#333] text-[18px] leading-relaxed font-medium">인천광역시 남동구<br /><span className="text-sm text-[#777]">(상세 주소는 예약 후 안내해 드려요!)</span></span>
                </div>
                <div>
                  <span className="block text-black text-[14px] tracking-[2px] mb-2 uppercase font-bold text-primary">📞 전화 / 문자</span>
                  <span className="text-[#333] text-[20px] font-bold">010 - 1234 - 5678</span>
                </div>
                <div>
                  <span className="block text-black text-[14px] tracking-[2px] mb-2 uppercase font-bold text-primary">🕐 운영 시간</span>
                  <span className="text-[#333] text-[18px] leading-relaxed font-medium"> 화-일 10:00 – 22:00<br /> <span className="text-danger font-bold">월요일 휴무</span></span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
                <a href="tel:01012345678" className="btn btn-primary text-xl px-10 py-5">
                  전화 걸기 📱
                </a>
                <a href="https://pf.kakao.com" target="_blank" rel="noreferrer" className="btn bg-[#FEE500] text-black border-none hover:bg-[#E5CF00] text-xl px-10 py-5">
                  카카오톡 문의 💬
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
