"use client";

import { useState } from "react";

export default function LpPage() {
  const [playingId, setPlayingId] = useState<string | null>(null);

  const lps = [
    {
      id: "abbey",
      genre: "Classic Rock · 1969",
      title: "Abbey Road",
      artist: "The Beatles",
      desc: "Come Together부터 Here Comes the Sun까지. 록 역사의 정점.",
      blank: true
    },
    {
      id: "umo",
      genre: "Psychedelic Soul · 2013",
      title: "II",
      artist: "Unknown Mortal Orchestra",
      desc: "몽환적인 사이키델릭 소울. 따뜻하고 흔들리는 아날로그 감성.",
      blank: true
    },
    {
      id: "supercar",
      genre: "Japanese Alternative · 2000",
      title: "Futurama",
      artist: "Supercar",
      desc: "전자음과 기타가 교차하는 미래적인 일본 얼터너티브 사운드.",
      blank: true
    }
  ];

  const togglePlay = (id: string) => {
    setPlayingId(playingId === id ? null : id);
  };

  return (
    <>
      <div className="page-header-band">
        <div className="container">
          <span className="eyebrow">THIS MONTH</span>
          <h1 className="giant-title">LP SHOWROOM</h1>
          <p className="page-header-desc">엄선된 바이닐 컬렉션을 청음해보세요.</p>
        </div>
      </div>

      <section className="py-24">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {lps.map((lp) => {
              const isPlaying = playingId === lp.id;
              return (
                <div key={lp.id} className="group relative">
                  <div className="w-full aspect-square relative mb-6 overflow-hidden bg-surface">
                    <div className="absolute inset-0 bg-surface transition-transform duration-500 group-hover:scale-105 group-hover:brightness-75" />
                    
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        onClick={() => togglePlay(lp.id)}
                        className={`w-16 h-16 rounded-full border border-white flex items-center justify-center transition-all duration-300 ${isPlaying ? 'bg-white text-black' : 'hover:bg-white hover:text-black'}`}
                      >
                        {isPlaying ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="3" width="4" height="18" rx="1"/><rect x="15" y="3" width="4" height="18" rx="1"/></svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4l13 8-13 8V4z"/></svg>
                        )}
                      </button>
                    </div>

                    {isPlaying && (
                      <div className="absolute bottom-6 left-6 flex items-end gap-[3px] h-4">
                        {[1,2,3,4,5,6,7].map(i => (
                          <span key={i} className="w-[3px] bg-accent animate-wave" style={{ animationDelay: `${i * 0.1}s` }}></span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <span className="block text-accent text-[11px] uppercase tracking-[2px] font-medium mb-3">{lp.genre}</span>
                    <h3 className="font-display text-[32px] italic text-white leading-none mb-1">{lp.title}</h3>
                    <p className="text-[#aaa] text-[15px] mb-4">{lp.artist}</p>
                    <p className="text-[#777] text-[14px] leading-relaxed">{lp.desc}</p>
                  </div>
                </div>
              )
            })}

          </div>
        </div>
      </section>
    </>
  );
}
