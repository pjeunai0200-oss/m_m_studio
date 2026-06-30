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

      <section className="py-24">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-[1000px] mx-auto">
            
            {/* Info Side */}
            <div>
              <div className="flex flex-col gap-10">
                <div>
                  <span className="block text-accent text-[11px] tracking-[2px] mb-2 uppercase">📍 위치</span>
                  <span className="text-white text-[17px] leading-relaxed">인천광역시 부평구<br /><span className="text-sm text-[#777]">(상세 주소는 예약 후 안내)</span></span>
                </div>
                <div>
                  <span className="block text-accent text-[11px] tracking-[2px] mb-2 uppercase">📞 전화 / 문자</span>
                  <span className="text-white text-[17px]">010 - XXXX - XXXX</span>
                </div>
                <div>
                  <span className="block text-accent text-[11px] tracking-[2px] mb-2 uppercase">🕐 운영 시간</span>
                  <span className="text-white text-[17px] leading-relaxed">드럼 작업실 10:00 – 22:00<br />월 임대실 24시간</span>
                </div>
              </div>
              
              <div className="flex gap-4 mt-12 pt-8 border-t border-border">
                <a href="#" className="text-xs text-muted hover:text-white tracking-[1px] transition-colors">INSTAGRAM</a>
                <a href="#" className="text-xs text-muted hover:text-white tracking-[1px] transition-colors">카카오채널</a>
                <a href="#" className="text-xs text-muted hover:text-white tracking-[1px] transition-colors">YOUTUBE</a>
              </div>
            </div>

            {/* Form Side */}
            <form className="flex flex-col gap-6 bg-surface p-8 border border-border" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-[#aaa] text-[13px] mb-2">이름 *</label>
                <input type="text" placeholder="홍길동" required className="w-full bg-dark2 border border-border text-white px-4 py-3 text-[15px] focus:border-accent focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-[#aaa] text-[13px] mb-2">연락처 *</label>
                <input type="tel" placeholder="010-0000-0000" required className="w-full bg-dark2 border border-border text-white px-4 py-3 text-[15px] focus:border-accent focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-[#aaa] text-[13px] mb-2">희망 공간</label>
                <select className="w-full bg-dark2 border border-border text-white px-4 py-3 text-[15px] focus:border-accent focus:outline-none transition-colors appearance-none">
                  <option value="">선택해주세요</option>
                  <option>드럼 작업실</option>
                  <option>개인 연습실 (월 임대)</option>
                  <option>LP 라운지</option>
                </select>
              </div>
              <div>
                <label className="block text-[#aaa] text-[13px] mb-2">문의 내용</label>
                <textarea rows={4} placeholder="궁금하신 점을 자유롭게 작성해주세요." className="w-full bg-dark2 border border-border text-white px-4 py-3 text-[15px] focus:border-accent focus:outline-none transition-colors resize-y" />
              </div>
              <button type="submit" className="btn btn-primary mt-2">문의 보내기</button>
            </form>
            
          </div>
        </div>
      </section>
    </>
  );
}
