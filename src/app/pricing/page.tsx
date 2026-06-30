"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";

const TIME_POINTS = [
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
  "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"
];

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export default function PricingPage() {
  const [room, setRoom] = useState<"drum" | "practice">("drum");
  const [addonStick, setAddonStick] = useState(false);
  const [addonDrink, setAddonDrink] = useState(false);
  
  // Calendar State
  const today = new Date();
  today.setHours(0,0,0,0);
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(today);
  
  // Time State
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [bookedSlots, setBookedSlots] = useState<Set<string>>(new Set());
  
  // User Info
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch reservations
  useEffect(() => {
    if (!selectedDate) return;

    const fetchReservations = async () => {
      // Add timezone offset to avoid JS date shifting before formatting
      const offsetDate = new Date(selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000));
      const dateStr = offsetDate.toISOString().split("T")[0];
      
      const { data, error } = await supabase
        .from("reservations")
        .select("start_time, duration_mins")
        .eq("reserve_date", dateStr)
        .eq("room_type", room);

      if (error) {
        console.error("Error fetching reservations:", error);
        return;
      }

      const booked = new Set<string>();
      data.forEach((res) => {
        const startIndex = TIME_POINTS.indexOf(res.start_time);
        if (startIndex === -1) return;
        const slotsCount = res.duration_mins / 30;
        for (let i = 0; i < slotsCount; i++) {
          if (TIME_POINTS[startIndex + i]) {
            booked.add(TIME_POINTS[startIndex + i]);
          }
        }
      });
      setBookedSlots(booked);
      setStartTime("");
      setEndTime("");
    };

    fetchReservations();
  }, [selectedDate, room]);

  // Calendar Helpers
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const daysArray = Array.from({ length: lastDate }, (_, i) => i + 1);

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  // Time Logic
  const getAvailableStartTimes = () => {
    // A start time is available if it's not the last point (22:00) and not booked
    return TIME_POINTS.slice(0, -1).filter(time => !bookedSlots.has(time));
  };

  const getAvailableEndTimes = () => {
    if (!startTime) return [];
    const startIndex = TIME_POINTS.indexOf(startTime);
    const availableEnds: string[] = [];
    
    // Check subsequent slots until we hit a booked slot or the end of day
    for (let i = startIndex + 1; i < TIME_POINTS.length; i++) {
      availableEnds.push(TIME_POINTS[i]);
      // If the slot starting at this time is booked, we can end AT this time, but cannot go further
      if (bookedSlots.has(TIME_POINTS[i])) {
        break;
      }
    }
    return availableEnds;
  };

  // Price Calculation
  const roomPricePerHour = room === "drum" ? 15000 : 10000;
  const roomName = room === "drum" ? "드럼 작업실" : "개인 연습실";
  
  let hours = 0;
  if (startTime && endTime) {
    const sIdx = TIME_POINTS.indexOf(startTime);
    const eIdx = TIME_POINTS.indexOf(endTime);
    if (eIdx > sIdx) {
      hours = (eIdx - sIdx) * 0.5;
    }
  }

  const roomTotal = hours * roomPricePerHour;
  const total = roomTotal + (addonStick ? 2000 : 0) + (addonDrink ? 3000 : 0);

  const handleBooking = async () => {
    if (!selectedDate || !startTime || !endTime || !userName || !userPhone) {
      alert("모든 필수 항목(날짜, 시간, 이름, 연락처)을 입력해주세요.");
      return;
    }
    if (hours <= 0) return;

    setIsLoading(true);
    const offsetDate = new Date(selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000));
    const dateStr = offsetDate.toISOString().split("T")[0];

    const { error } = await supabase.from("reservations").insert([
      {
        room_type: room,
        reserve_date: dateStr,
        start_time: startTime,
        duration_mins: hours * 60,
        user_name: userName,
        user_phone: userPhone,
        addon_stick: addonStick,
        addon_drink: addonDrink,
        total_price: total
      }
    ]);

    setIsLoading(false);

    if (error) {
      alert("예약 처리 중 오류가 발생했습니다.");
    } else {
      setShowModal(true);
      // Visually update immediately
      setBookedSlots(prev => {
        const newSet = new Set(prev);
        const sIdx = TIME_POINTS.indexOf(startTime);
        const eIdx = TIME_POINTS.indexOf(endTime);
        for(let i = sIdx; i < eIdx; i++){
          newSet.add(TIME_POINTS[i]);
        }
        return newSet;
      });
    }
  };

  return (
    <>
      <div className="page-header-band">
        <div className="container">
          <span className="eyebrow">BOOKING</span>
          <h1 className="giant-title">예약하기</h1>
          <p className="page-header-desc">공간과 날짜, 시간을 선택하고 빠르고 쉽게 예약하세요.</p>
        </div>
      </div>

      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 max-w-[1100px] mx-auto">
            
            {/* Options Panel */}
            <div className="flex flex-col gap-10 bg-surface border border-border p-8 rounded-sm">
              
              {/* 1. Space Selection */}
              <div>
                <label className="block text-accent text-xs tracking-[2px] mb-4">1. 공간 선택</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className={`block border border-border p-5 cursor-pointer transition-colors ${room === "drum" ? "bg-[rgba(143,175,136,0.1)] border-accent" : "hover:bg-[rgba(255,255,255,0.03)]"}`}>
                    <input type="radio" value="drum" checked={room === "drum"} onChange={() => setRoom("drum")} className="hidden" />
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="block text-white text-[17px] mb-1 font-medium">드럼 작업실</span>
                        <span className="text-[#888] text-[13px]">녹음 · 합주</span>
                      </div>
                      <span className="text-accent text-[15px]">15,000 / h</span>
                    </div>
                  </label>
                  <label className={`block border border-border p-5 cursor-pointer transition-colors ${room === "practice" ? "bg-[rgba(143,175,136,0.1)] border-accent" : "hover:bg-[rgba(255,255,255,0.03)]"}`}>
                    <input type="radio" value="practice" checked={room === "practice"} onChange={() => setRoom("practice")} className="hidden" />
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="block text-white text-[17px] mb-1 font-medium">개인 연습실</span>
                        <span className="text-[#888] text-[13px]">월 임대 · 24시간</span>
                      </div>
                      <span className="text-accent text-[15px]">10,000 / h</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* 2. Date & Time Selection */}
              <div className="border-t border-border pt-10">
                <label className="block text-accent text-xs tracking-[2px] mb-6">2. 날짜 및 시간 선택</label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Calendar Grid */}
                  <div className="bg-dark2 border border-border p-5 rounded-sm">
                    <div className="flex justify-between items-center mb-6 px-2">
                      <button onClick={prevMonth} className="text-[#888] hover:text-white p-1">&#8592;</button>
                      <span className="text-white font-medium text-[15px]">{year}년 {month + 1}월</span>
                      <button onClick={nextMonth} className="text-[#888] hover:text-white p-1">&#8594;</button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                      {WEEKDAYS.map(day => (
                        <div key={day} className="text-[#666] text-xs py-2">{day}</div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: firstDayIndex }).map((_, i) => (
                        <div key={`empty-${i}`} className="p-2"></div>
                      ))}
                      {daysArray.map(day => {
                        const dateObj = new Date(year, month, day);
                        const isPast = dateObj < today;
                        const isSelected = selectedDate?.toDateString() === dateObj.toDateString();
                        
                        return (
                          <button
                            key={day}
                            disabled={isPast}
                            onClick={() => setSelectedDate(dateObj)}
                            className={`w-full aspect-square flex items-center justify-center text-[14px] rounded-full transition-colors ${
                              isPast ? "text-[#444] cursor-not-allowed" 
                              : isSelected ? "bg-accent text-black font-medium" 
                              : "text-[#ddd] hover:bg-[rgba(255,255,255,0.1)]"
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time Selection */}
                  <div className="flex flex-col gap-5 justify-center">
                    <div>
                      <label className="block text-[#aaa] text-[13px] mb-2">시작 시간</label>
                      <select 
                        className="w-full bg-dark2 border border-border text-white px-4 py-3 text-[15px] focus:border-accent focus:outline-none transition-colors appearance-none"
                        value={startTime}
                        onChange={(e) => {
                          setStartTime(e.target.value);
                          setEndTime(""); // Reset end time
                        }}
                      >
                        <option value="">시작 시간을 선택하세요</option>
                        {getAvailableStartTimes().map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[#aaa] text-[13px] mb-2">종료 시간</label>
                      <select 
                        className="w-full bg-dark2 border border-border text-white px-4 py-3 text-[15px] focus:border-accent focus:outline-none transition-colors appearance-none disabled:opacity-50"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        disabled={!startTime}
                      >
                        <option value="">종료 시간을 선택하세요</option>
                        {getAvailableEndTimes().map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    {hours > 0 && (
                      <div className="mt-2 text-right">
                        <span className="inline-block bg-[rgba(143,175,136,0.15)] text-accent px-4 py-2 rounded-full text-[13px] tracking-[1px]">
                          총 {hours}시간 선택됨
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 3. Add-ons */}
              <div className="border-t border-border pt-10">
                <label className="block text-accent text-xs tracking-[2px] mb-4">3. 추가 옵션</label>
                <div className="flex flex-col gap-3">
                  <label className={`flex items-center p-4 border border-border cursor-pointer transition-colors ${addonStick ? "bg-[rgba(143,175,136,0.05)] border-accent" : "hover:bg-[rgba(255,255,255,0.02)]"}`}>
                    <input type="checkbox" checked={addonStick} onChange={(e) => setAddonStick(e.target.checked)} className="hidden" />
                    <span className="text-xl mr-4 opacity-70">🥁</span>
                    <span className="text-[#ddd] text-[15px] flex-1">드럼 스틱 대여</span>
                    <span className="text-accent text-[14px]">+ 2,000원</span>
                  </label>
                  <label className={`flex items-center p-4 border border-border cursor-pointer transition-colors ${addonDrink ? "bg-[rgba(143,175,136,0.05)] border-accent" : "hover:bg-[rgba(255,255,255,0.02)]"}`}>
                    <input type="checkbox" checked={addonDrink} onChange={(e) => setAddonDrink(e.target.checked)} className="hidden" />
                    <span className="text-xl mr-4 opacity-70">☕</span>
                    <span className="text-[#ddd] text-[15px] flex-1">음료 이용권</span>
                    <span className="text-accent text-[14px]">+ 3,000원</span>
                  </label>
                </div>
              </div>

              {/* 4. User Info */}
              <div className="border-t border-border pt-10">
                <label className="block text-accent text-xs tracking-[2px] mb-6">4. 예약자 정보</label>
                <div className="flex flex-col gap-5">
                  <div>
                    <input 
                      type="text" placeholder="예약자 성함" value={userName} onChange={e => setUserName(e.target.value)}
                      className="w-full bg-dark2 border border-border text-white px-4 py-3 text-[15px] focus:border-accent focus:outline-none transition-colors" 
                    />
                  </div>
                  <div>
                    <input 
                      type="tel" placeholder="연락처 (010-0000-0000)" value={userPhone} onChange={e => setUserPhone(e.target.value)}
                      className="w-full bg-dark2 border border-border text-white px-4 py-3 text-[15px] focus:border-accent focus:outline-none transition-colors" 
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Receipt Sidebar */}
            <div className="bg-white text-black p-8 shadow-xl sticky top-[120px] h-fit font-[monospace]">
              <div className="flex justify-between border-b border-dashed border-[#ccc] pb-4 mb-6">
                <span className="font-bold text-lg">M.M.STUDIO</span>
                <span className="text-[#666]">결제 내역서</span>
              </div>
              <div className="flex flex-col gap-3 mb-6 border-b border-dashed border-[#ccc] pb-6">
                <div className="flex justify-between text-[15px] mb-2 text-[#444]">
                  <span>일정</span>
                  <span className="text-right">
                    {selectedDate ? `${selectedDate.getFullYear()}년 ${selectedDate.getMonth()+1}월 ${selectedDate.getDate()}일` : '날짜 미선택'}<br/>
                    {startTime && endTime ? `${startTime} ~ ${endTime} (${hours}시간)` : '시간 미선택'}
                  </span>
                </div>
                <div className="flex justify-between text-[15px]">
                  <span>{roomName}</span>
                  <span>{roomTotal.toLocaleString()}원</span>
                </div>
                {addonStick && (
                  <div className="flex justify-between text-[15px] text-[#555]">
                    <span>스틱 대여</span>
                    <span>2,000원</span>
                  </div>
                )}
                {addonDrink && (
                  <div className="flex justify-between text-[15px] text-[#555]">
                    <span>음료 이용권</span>
                    <span>3,000원</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-end mb-8">
                <span className="text-[#444] font-bold">총 결제 금액</span>
                <span className="text-2xl font-bold">{total.toLocaleString()}원</span>
              </div>
              <button 
                onClick={handleBooking}
                disabled={isLoading || hours <= 0}
                className="w-full bg-black text-white py-4 font-body font-medium tracking-[1px] text-[15px] hover:bg-accent transition-colors disabled:opacity-50"
              >
                {isLoading ? "처리 중..." : "예약 신청 완료하기"}
              </button>
            </div>
            
          </div>
        </div>
      </section>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[2000] flex items-center justify-center p-4 animate-fadeUp">
          <div className="bg-dark2 border border-border p-10 max-w-[420px] w-full text-center relative">
            <p className="text-4xl mb-4">🎉</p>
            <h2 className="text-white text-2xl mb-3 font-medium">예약이 확정되었습니다!</h2>
            <p className="text-[#aaa] mb-8 text-[15px] leading-relaxed">
              {selectedDate?.getFullYear()}년 {selectedDate?.getMonth()! + 1}월 {selectedDate?.getDate()}일<br/>
              {startTime} ~ {endTime} ({hours}시간)<br/>
              {roomName} 예약이 완료되었습니다.
            </p>
            <button 
              onClick={() => {
                setShowModal(false);
                setStartTime("");
                setEndTime("");
                setUserName("");
                setUserPhone("");
              }} 
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
