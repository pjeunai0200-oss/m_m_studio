"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function RoomsPage() {
  const [activeIdx, setActiveIdx] = useState(0);

  const slides = [
    {
      id: "drum",
      img: "/adult_drum_pastel_1782866300088.png",
      tag: "스트레스 해소",
      title: "파스텔 드럼방",
      desc: "마치 볼풀장 같은 푹신하고 귀여운 공간에서 프로페셔널한 드럼을 즐겨보세요! 방음 완비로 눈치보지 않고 신나게 두드릴 수 있습니다.",
      price: "15,000",
      btnText: "요금 계산하기",
      btnLink: "/pricing"
    },
    {
      id: "practice",
      img: "/adult_drum_neon_1782866317922.png",
      tag: "신나는 무대",
      title: "어른이 노래방 & 무대",
      desc: "통통 튀는 조명과 무대 세팅! 노래방 기기가 완비된 방에서 마음껏 소리 지르며 스트레스를 날려버리세요.",
      price: "10,000",
      btnText: "예약 문의하기",
      btnLink: "/contact"
    },
    {
      id: "lp",
      img: "/adult_lounge_fun_1782866308733.png",
      tag: "동심 힐링",
      title: "키즈카페 라운지",
      desc: "장난감 가득한 방에서 어른 체격에 맞춘 커다란 빈백에 누워 휴식하세요. 연주 후 동심으로 돌아가는 힐링 타임!",
      price: "무료",
      priceSub: " (이용자 전용)",
      btnText: "메인으로",
      btnLink: "/"
    }
  ];

  const handlePrev = () => setActiveIdx(prev => Math.max(0, prev - 1));
  const handleNext = () => setActiveIdx(prev => Math.min(slides.length - 1, prev + 1));

  return (
    <>
      <div className="page-header-band">
        <div className="container">
          <span className="eyebrow">OUR SPACES</span>
          <h1 className="giant-title text-accent">어른이 놀이공간</h1>
          <p className="page-header-desc">
            스트레스 타파 파스텔 드럼방부터 힐링 라운지까지,<br />어른이들을 위한 신나는 놀이터를 소개합니다!
          </p>
        </div>
      </div>

      <section className="py-24">
        <div className="relative max-w-[1200px] mx-auto px-[50px] md:px-[80px]">
          <button 
            className="absolute left-0 top-1/2 -translate-y-1/2 w-[50px] h-[50px] bg-transparent border-none text-secondary text-5xl font-black opacity-60 hover:opacity-100 disabled:opacity-20 transition-opacity z-10"
            onClick={handlePrev}
            disabled={activeIdx === 0}
            aria-label="이전"
          >
            &#8592;
          </button>
          
          <div className="overflow-hidden relative">
            <div 
              className="flex transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
              style={{ transform: `translateX(-${activeIdx * 100}%)` }}
            >
              {slides.map((slide, i) => (
                <div key={slide.id} className="min-w-full px-4 flex flex-col md:flex-row gap-8 items-center">
                  <div className="w-full md:w-3/5 aspect-[4/3] relative rounded-sm overflow-hidden bg-surface">
                    <Image src={slide.img} alt={slide.title} fill className="object-cover" />
                  </div>
                  <div className={`w-full md:w-2/5 p-6 md:p-8 flex flex-col justify-center transition-all duration-700 ${activeIdx === i ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <span className="inline-block px-3 py-1 bg-white text-primary text-xs tracking-[1px] font-bold rounded-full w-fit mb-4 shadow-sm">{slide.tag}</span>
                    <h3 className="font-display text-4xl mb-4 font-normal text-secondary">{slide.title}</h3>
                    <p className="text-[#555] text-[16px] mb-8 leading-relaxed font-medium">{slide.desc}</p>
                    <span className="text-[32px] font-display font-medium text-danger mb-6">
                      {slide.price}
                      <small className="text-sm font-body text-[#666] font-normal">{slide.priceSub || '원 / 시간'}</small>
                    </span>
                    <Link href={slide.btnLink} className="btn btn-primary w-fit mt-2">
                      {slide.btnText}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            className="absolute right-0 top-1/2 -translate-y-1/2 w-[50px] h-[50px] bg-transparent border-none text-secondary text-5xl font-black opacity-60 hover:opacity-100 disabled:opacity-20 transition-opacity z-10"
            onClick={handleNext}
            disabled={activeIdx === slides.length - 1}
            aria-label="다음"
          >
            &#8594;
          </button>
        </div>

        <div className="flex justify-center gap-4 mt-12">
          {slides.map((_, i) => (
            <button 
              key={i} 
              className={`w-12 h-2 rounded-full bg-secondary transition-opacity ${activeIdx === i ? 'opacity-100' : 'opacity-20 hover:opacity-50'}`}
              onClick={() => setActiveIdx(i)}
            />
          ))}
        </div>
      </section>

      <section className="bg-[#FFF8E7] border-y border-[#FFD166] py-12">
        <div className="container flex flex-wrap justify-between gap-8 text-center max-w-[900px]">
          <div><span className="block font-display text-[32px] italic text-[#EF476F] leading-none mb-1">100%</span><span className="text-[13px] text-[#64748b] tracking-[1px] font-bold">동심 충전</span></div>
          <div><span className="block font-display text-[32px] italic text-[#EF476F] leading-none mb-1">PRO</span><span className="text-[13px] text-[#64748b] tracking-[1px] font-bold">전문 드럼 완비</span></div>
          <div><span className="block font-display text-[32px] italic text-[#EF476F] leading-none mb-1">24H</span><span className="text-[13px] text-[#64748b] tracking-[1px] font-bold">언제든 신나게</span></div>
          <div><span className="block font-display text-[32px] italic text-[#EF476F] leading-none mb-1">FREE</span><span className="text-[13px] text-[#64748b] tracking-[1px] font-bold">라운지 이용</span></div>
        </div>
      </section>
    </>
  );
}
