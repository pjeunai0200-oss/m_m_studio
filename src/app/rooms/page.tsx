"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function RoomsPage() {
  const [activeIdx, setActiveIdx] = useState(0);

  const slides = [
    {
      id: "drum",
      img: "/card_drum_studio.png",
      tag: "녹음 · 합주 · 레슨",
      title: "드럼 작업실",
      desc: "전문 녹음 및 개인 연습용 최상급 세팅. 외경 6m × 5m의 넓은 공간에서 제약 없이 연주하세요.",
      price: "15,000",
      btnText: "요금 계산하기",
      btnLink: "/pricing"
    },
    {
      id: "practice",
      img: "/card_practice_room.png",
      tag: "24시간 운영",
      title: "월 임대 연습실",
      desc: "전공생들을 위한 24시간 지정 대여 연습실. 나만의 공간에서 집중적으로 실력을 키우세요.",
      price: "10,000",
      btnText: "문의하기",
      btnLink: "/contact"
    },
    {
      id: "lp",
      img: "/card_lp_lounge.png",
      tag: "청음 · 휴식",
      title: "LP 청음 & 감성 라운지",
      desc: "따뜻한 조명 아래 턴테이블과 음악 잡지가 있는 힐링 공간. 연주 후 아날로그 감성으로 쉬어가세요.",
      price: "무료",
      priceSub: " (예약자 전용)",
      btnText: "LP 쇼룸 보기",
      btnLink: "/lp"
    }
  ];

  const handlePrev = () => setActiveIdx(prev => Math.max(0, prev - 1));
  const handleNext = () => setActiveIdx(prev => Math.min(slides.length - 1, prev + 1));

  return (
    <>
      <div className="page-header-band">
        <div className="container">
          <span className="eyebrow">OUR SPACES</span>
          <h1 className="giant-title">THE ROOMS</h1>
          <p className="page-header-desc">
            드럼 작업실부터 감성 LP 라운지까지,<br />음악인들의 모든 것이 이 곳에 있습니다.
          </p>
        </div>
      </div>

      <section className="py-24">
        <div className="relative max-w-[1200px] mx-auto px-[50px] md:px-[80px]">
          <button 
            className="absolute left-0 top-1/2 -translate-y-1/2 w-[50px] h-[50px] bg-transparent border-none text-white text-3xl opacity-60 hover:opacity-100 disabled:opacity-20 transition-opacity z-10"
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
                    <span className="inline-block px-3 py-1 bg-[rgba(255,255,255,0.1)] text-white text-xs tracking-[1px] font-medium rounded-sm w-fit mb-4">{slide.tag}</span>
                    <h3 className="font-display text-4xl mb-4 font-normal text-white">{slide.title}</h3>
                    <p className="text-[#aaa] text-[15px] mb-8 leading-relaxed">{slide.desc}</p>
                    <span className="text-[28px] font-display font-medium text-white mb-6">
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
            className="absolute right-0 top-1/2 -translate-y-1/2 w-[50px] h-[50px] bg-transparent border-none text-white text-3xl opacity-60 hover:opacity-100 disabled:opacity-20 transition-opacity z-10"
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
              className={`w-12 h-1 bg-white transition-opacity ${activeIdx === i ? 'opacity-100' : 'opacity-20 hover:opacity-50'}`}
              onClick={() => setActiveIdx(i)}
            />
          ))}
        </div>
      </section>

      <section className="bg-dark2 border-y border-border py-12">
        <div className="container flex flex-wrap justify-between gap-8 text-center max-w-[900px]">
          <div><span className="block font-display text-[32px] italic text-accent leading-none mb-1">50cm</span><span className="text-xs text-muted tracking-[1px]">이중 방음벽</span></div>
          <div><span className="block font-display text-[32px] italic text-accent leading-none mb-1">24H</span><span className="text-xs text-muted tracking-[1px]">월 임대 운영</span></div>
          <div><span className="block font-display text-[32px] italic text-accent leading-none mb-1">3+</span><span className="text-xs text-muted tracking-[1px]">전용 공간</span></div>
          <div><span className="block font-display text-[32px] italic text-accent leading-none mb-1">100+</span><span className="text-xs text-muted tracking-[1px]">LP 컬렉션</span></div>
        </div>
      </section>
    </>
  );
}
