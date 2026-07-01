"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [activeTab, setActiveTab] = useState<"reservations" | "inquiries" | "settings">("reservations");

  const [reservations, setReservations] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  
  const [settings, setSettings] = useState({
    instagram: "",
    kakao: "",
    youtube: ""
  });
  const [isSaving, setIsSaving] = useState(false);

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === "admin1234") {
      setIsAuthenticated(true);
      fetchData();
    } else {
      alert("비밀번호가 틀렸습니다.");
      setPasswordInput("");
    }
  };

  const fetchData = async () => {
    // Fetch Reservations
    const resResponse = await supabase.from("reservations").select("*").order("created_at", { ascending: false });
    if (resResponse.data) setReservations(resResponse.data);

    // Fetch Inquiries
    const inqResponse = await supabase.from("inquiries").select("*").order("created_at", { ascending: false });
    if (inqResponse.data) setInquiries(inqResponse.data);

    // Fetch Settings
    const setResponse = await supabase.from("settings").select("*");
    if (setResponse.data) {
      const newSettings = { instagram: "", kakao: "", youtube: "" };
      setResponse.data.forEach(item => {
        if (item.key === "instagram") newSettings.instagram = item.value;
        if (item.key === "kakao") newSettings.kakao = item.value;
        if (item.key === "youtube") newSettings.youtube = item.value;
      });
      setSettings(newSettings);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Upsert settings
    await supabase.from("settings").upsert([
      { key: "instagram", value: settings.instagram },
      { key: "kakao", value: settings.kakao },
      { key: "youtube", value: settings.youtube }
    ]);
    
    setIsSaving(false);
    alert("설정이 저장되었습니다.");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <form onSubmit={handleLogin} className="bg-surface border border-border p-10 max-w-sm w-full rounded-sm text-center">
          <span className="font-display text-2xl italic tracking-wide text-white block mb-8">M.M.STUDIO Admin</span>
          <input 
            type="password" 
            placeholder="비밀번호 입력" 
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="w-full bg-dark2 border border-border text-white px-4 py-3 mb-4 focus:border-accent focus:outline-none" 
          />
          <button type="submit" className="w-full bg-accent text-black font-medium py-3 hover:bg-accentHover transition-colors">
            로그인
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <div className="bg-surface border-b border-border sticky top-0 z-10">
        <div className="container py-4 flex justify-between items-center">
          <span className="font-display text-xl italic text-white">M.M.STUDIO Admin Dashboard</span>
          <button onClick={() => setIsAuthenticated(false)} className="text-sm text-muted hover:text-white transition-colors">로그아웃</button>
        </div>
      </div>

      <div className="container py-10">
        {/* Tabs */}
        <div className="flex gap-2 mb-10 border-b border-border pb-4 overflow-x-auto scrollbar-hide">
          <button 
            onClick={() => setActiveTab("reservations")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${activeTab === "reservations" ? "bg-accent text-black" : "bg-dark2 text-[#aaa] hover:text-white border border-border"}`}
          >
            예약 내역 관리
          </button>
          <button 
            onClick={() => setActiveTab("inquiries")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${activeTab === "inquiries" ? "bg-accent text-black" : "bg-dark2 text-[#aaa] hover:text-white border border-border"}`}
          >
            고객 문의 관리
          </button>
          <button 
            onClick={() => setActiveTab("settings")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${activeTab === "settings" ? "bg-accent text-black" : "bg-dark2 text-[#aaa] hover:text-white border border-border"}`}
          >
            사이트 설정 (SNS)
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-surface border border-border p-6 rounded-sm min-h-[500px]">
          
          {/* Reservations Tab */}
          {activeTab === "reservations" && (
            <div>
              <h2 className="text-lg text-white mb-6 font-medium">최신 예약 내역</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b border-border text-[#aaa] text-sm">
                      <th className="py-3 px-4 font-medium">접수일시</th>
                      <th className="py-3 px-4 font-medium">공간</th>
                      <th className="py-3 px-4 font-medium">예약 날짜 및 시간</th>
                      <th className="py-3 px-4 font-medium">예약자</th>
                      <th className="py-3 px-4 font-medium">연락처</th>
                      <th className="py-3 px-4 font-medium">결제금액</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {reservations.length === 0 && (
                      <tr><td colSpan={6} className="py-10 text-center text-muted">데이터가 없습니다.</td></tr>
                    )}
                    {reservations.map((res) => (
                      <tr key={res.id} className="border-b border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                        <td className="py-4 px-4 text-[#888]">{new Date(res.created_at).toLocaleString('ko-KR')}</td>
                        <td className="py-4 px-4">{res.room_type === "drum" ? "드럼 작업실" : "개인 연습실"}</td>
                        <td className="py-4 px-4 text-accent font-medium">
                          {res.reserve_date} <br/>
                          <span className="text-white font-normal">{res.start_time} ({res.duration_mins/60}h)</span>
                        </td>
                        <td className="py-4 px-4 text-white">{res.user_name}</td>
                        <td className="py-4 px-4 text-[#aaa]">{res.user_phone}</td>
                        <td className="py-4 px-4 text-white font-[monospace]">{res.total_price.toLocaleString()}원</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Inquiries Tab */}
          {activeTab === "inquiries" && (
            <div>
              <h2 className="text-lg text-white mb-6 font-medium">고객 문의 내역</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inquiries.length === 0 && (
                  <p className="py-10 text-muted col-span-2 text-center">데이터가 없습니다.</p>
                )}
                {inquiries.map((inq) => (
                  <div key={inq.id} className="bg-dark2 border border-border p-5 rounded-sm">
                    <div className="flex justify-between items-start mb-4 border-b border-border pb-3">
                      <div>
                        <span className="text-white font-medium block mb-1">{inq.name}</span>
                        <span className="text-accent text-sm">{inq.phone}</span>
                      </div>
                      <span className="text-xs text-[#888]">{new Date(inq.created_at).toLocaleString('ko-KR')}</span>
                    </div>
                    {inq.room && <span className="inline-block bg-[rgba(255,255,255,0.05)] text-xs text-[#aaa] px-2 py-1 mb-3 rounded-sm">희망 공간: {inq.room}</span>}
                    <p className="text-[#ddd] text-sm leading-relaxed whitespace-pre-wrap">{inq.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="max-w-xl">
              <h2 className="text-lg text-white mb-2 font-medium">사이트 설정</h2>
              <p className="text-sm text-[#888] mb-8">홈페이지 하단(Footer) 및 문의하기 페이지에 연결될 SNS 주소를 변경합니다.</p>
              
              <form onSubmit={handleSaveSettings} className="flex flex-col gap-6">
                <div>
                  <label className="block text-[#aaa] text-[13px] mb-2 uppercase tracking-[1px]">Instagram 링크</label>
                  <input 
                    type="url" 
                    value={settings.instagram}
                    onChange={e => setSettings({...settings, instagram: e.target.value})}
                    placeholder="https://instagram.com/..." 
                    className="w-full bg-dark2 border border-border text-white px-4 py-3 text-[15px] focus:border-accent focus:outline-none transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-[#aaa] text-[13px] mb-2 uppercase tracking-[1px]">카카오톡 채널 링크</label>
                  <input 
                    type="url" 
                    value={settings.kakao}
                    onChange={e => setSettings({...settings, kakao: e.target.value})}
                    placeholder="https://pf.kakao.com/..." 
                    className="w-full bg-dark2 border border-border text-white px-4 py-3 text-[15px] focus:border-accent focus:outline-none transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-[#aaa] text-[13px] mb-2 uppercase tracking-[1px]">YouTube 링크</label>
                  <input 
                    type="url" 
                    value={settings.youtube}
                    onChange={e => setSettings({...settings, youtube: e.target.value})}
                    placeholder="https://youtube.com/..." 
                    className="w-full bg-dark2 border border-border text-white px-4 py-3 text-[15px] focus:border-accent focus:outline-none transition-colors" 
                  />
                </div>
                <button type="submit" disabled={isSaving} className="btn btn-primary w-fit mt-4">
                  {isSaving ? "저장 중..." : "설정 저장하기"}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
