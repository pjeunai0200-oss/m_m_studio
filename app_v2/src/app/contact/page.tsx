"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [settings, setSettings] = useState({ instagram: "#", kakao: "#", youtube: "#" });

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from("settings").select("*");
      if (data) {
        const newSettings = { instagram: "#", kakao: "#", youtube: "#" };
        data.forEach(item => {
          if (item.key === "instagram") newSettings.instagram = item.value;
          if (item.key === "kakao") newSettings.kakao = item.value;
          if (item.key === "youtube") newSettings.youtube = item.value;
        });
        setSettings(newSettings);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) {
      alert("이름, 연락처, 문의 내용을 모두 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.from("inquiries").insert([
        { name, phone, room, message }
      ]);

      if (error) {
        console.error(error);
        alert("문의 발송 중 오류가 발생했습니다: " + error.message);
      } else {
        setShowModal(true);
      }
    } catch (err: any) {
      console.error(err);
      alert("네트워크 또는 설정 오류가 발생했습니다. Vercel 환경변수를 확인해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setName("");
    setPhone("");
    setRoom("");
    setMessage("");
  };

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
                  <span className="block text-black text-[13px] tracking-[2px] mb-2 uppercase">📍 위치</span>
                  <span className="text-secondary text-[17px] leading-relaxed font-medium">인천광역시 남동구<br /><span className="text-sm text-[#777]">(상세 주소는 예약 후 안내)</span></span>
                </div>
                <div>
                  <span className="block text-black text-[13px] tracking-[2px] mb-2 uppercase">📞 전화 / 문자</span>
                  <span className="text-secondary text-[17px] font-medium">010 - XXXX - XXXX</span>
                </div>
                <div>
                  <span className="block text-black text-[13px] tracking-[2px] mb-2 uppercase">🕐 운영 시간</span>
                  <span className="text-secondary text-[17px] leading-relaxed font-medium"> 화-일 10:00 – 22:00<br /> 월요일 휴무 </span>
                </div>
              </div>

              <div className="flex gap-4 mt-12 pt-8 border-t border-border">
                <a href={settings.instagram} target="_blank" rel="noreferrer" className="text-xs text-[#666] hover:text-primary font-bold tracking-[1px] transition-colors">INSTAGRAM</a>
                <a href={settings.kakao} target="_blank" rel="noreferrer" className="text-xs text-[#666] hover:text-primary font-bold tracking-[1px] transition-colors">카카오채널</a>
                <a href={settings.youtube} target="_blank" rel="noreferrer" className="text-xs text-[#666] hover:text-primary font-bold tracking-[1px] transition-colors">YOUTUBE</a>
              </div>
            </div>

            {/* Form Side */}
            <form className="flex flex-col gap-6 bg-white p-8 border border-border" onSubmit={handleSubmit}>
              <div>
                <label className="block text-[#666] text-[13px] mb-2 font-bold">이름 *</label>
                <input
                  type="text"
                  placeholder="홍길동"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-border text-black px-4 py-3 text-[15px] focus:border-primary focus:outline-none transition-colors font-medium placeholder-[#aaa]"
                />
              </div>
              <div>
                <label className="block text-[#666] text-[13px] mb-2 font-bold">연락처 *</label>
                <input
                  type="tel"
                  placeholder="010-0000-0000"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white border border-border text-black px-4 py-3 text-[15px] focus:border-primary focus:outline-none transition-colors font-medium placeholder-[#aaa]"
                />
              </div>
              <div>
                <label className="block text-[#666] text-[13px] mb-2 font-bold">희망 공간</label>
                <select
                  className="w-full bg-white border border-border text-black px-4 py-3 text-[15px] focus:border-primary focus:outline-none transition-colors appearance-none font-medium"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                >
                  <option value="">선택해주세요</option>
                  <option value="drum">파스텔 드럼방</option>
                  <option value="practice">어른이 노래방 & 무대</option>
                  <option value="lp">LP 라운지</option>
                  <option value="other">기타</option>
                </select>
              </div>
              <div>
                <label className="block text-[#666] text-[13px] mb-2 font-bold">문의 내용 *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="궁금하신 점을 자유롭게 작성해주세요."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-white border border-border text-black px-4 py-3 text-[15px] focus:border-primary focus:outline-none transition-colors resize-y font-medium placeholder-[#aaa]"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary mt-2 disabled:opacity-50"
              >
                {isLoading ? "전송 중..." : "문의 보내기"}
              </button>
            </form>

          </div>
        </div>
      </section>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4 animate-bounceUp">
          <div className="bg-white rounded-2xl border border-border p-10 max-w-[420px] w-full text-center relative shadow-2xl">
            <p className="text-5xl mb-4">💬</p>
            <h2 className="text-secondary text-3xl mb-3 font-display">문의가 접수되었습니다!</h2>
            <p className="text-[#555] mb-8 text-[16px] leading-relaxed font-medium">
              남겨주신 연락처로 최대한 빠르게<br />
              답변해 드리겠습니다. 감사합니다.
            </p>
            <button
              onClick={closeModal}
              className="btn btn-primary btn-block"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </>
  );
}
