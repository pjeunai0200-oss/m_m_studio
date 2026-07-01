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
  today.setHours(0, 0, 0, 0);
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
  const roomName = room === "drum" ? "파스텔 드럼방" : "어른이 노래방 & 무대";

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

    try {
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

      if (error) {
        alert("예약 처리 중 오류가 발생했습니다: " + error.message);
      } else {
        setShowModal(true);
        // Visually update immediately
        setBookedSlots(prev => {
          const newSet = new Set(prev);
          const sIdx = TIME_POINTS.indexOf(startTime);
          const eIdx = TIME_POINTS.indexOf(endTime);
          for (let i = sIdx; i < eIdx; i++) {
            newSet.add(TIME_POINTS[i]);
          }
          return newSet;
        });
      }
    } catch (err: any) {
      console.error(err);
      alert("네트워크 또는 환경변수 설정 오류가 발생했습니다. Vercel 설정을 확인해주세요.");
    } finally {
      setIsLoading(false);
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
                <label className="block text-black text-xs tracking-[2px] mb-4">1. 공간 선택</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className={`block border border-border p-5 cursor-pointer transition-colors ${room === "drum" ? "bg-[rgba(6,214,160,0.1)] border-primary" : "hover:bg-[rgba(0,0,0,0.02)]"}`}>
                    <input type="radio" value="drum" checked={room === "drum"} onChange={() => setRoom("drum")} className="hidden" />
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="block text-secondary text-[17px] mb-1 font-bold">파스텔 드럼방</span>
                        <span className="text-[#666] text-[13px] font-medium">신나는 스트레스 해소</span>
                      </div>
                      <span className="text-danger font-bold text-[15px]">15,000 / h</span>
                    </div>
                  </label>
                  <label className={`block border border-border p-5 cursor-pointer transition-colors ${room === "practice" ? "bg-[rgba(6,214,160,0.1)] border-primary" : "hover:bg-[rgba(0,0,0,0.02)]"}`}>
                    <input type="radio" value="practice" checked={room === "practice"} onChange={() => setRoom("practice")} className="hidden" />
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="block text-secondary text-[17px] mb-1 font-bold">어른이 노래방 & 무대</span>
                        <span className="text-[#666] text-[13px] font-medium">통통 튀는 무대 세팅</span>
                      </div>
                      <span className="text-danger font-bold text-[15px]">10,000 / h</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* 2. Date & Time Selection */}
              <div className="border-t border-border pt-10">
                <label className="block text-black text-xs tracking-[2px] mb-6">2. 날짜 및 시간 선택</label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Calendar Grid */}
                  <div className="bg-white border border-border p-5 rounded-sm">
                    <div className="flex justify-between items-center mb-6 px-2">
                      <button onClick={prevMonth} className="text-[#888] hover:text-secondary p-1">&#8592;</button>
                      <span className="text-secondary font-bold text-[16px]">{year}년 {month + 1}월</span>
                      <button onClick={nextMonth} className="text-[#888] hover:text-secondary p-1">&#8594;</button>
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
                            className={`w-full aspect-square flex items-center justify-center text-[14px] rounded-full transition-colors ${isPast ? "text-[#ccc] cursor-not-allowed"
                              : isSelected ? "bg-primary text-white font-bold shadow-md"
                                : "text-[#555] hover:bg-[rgba(0,0,0,0.05)] font-medium"
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
                      <label className="block text-[#666] text-[13px] mb-2 font-bold">시작 시간</label>
                      <select
                        className="w-full bg-white border border-border text-black px-4 py-3 text-[15px] focus:border-primary focus:outline-none transition-colors appearance-none font-medium"
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
                      <label className="block text-[#666] text-[13px] mb-2 font-bold">종료 시간</label>
                      <select
                        className="w-full bg-white border border-border text-black px-4 py-3 text-[15px] focus:border-primary focus:outline-none transition-colors appearance-none disabled:opacity-50 font-medium"
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
                <label className="block text-black text-xs tracking-[2px] mb-4">3. 추가 옵션</label>
                <div className="flex flex-col gap-3">
                  <label className={`flex items-center p-4 border border-border cursor-pointer transition-colors ${addonStick ? "bg-[rgba(6,214,160,0.05)] border-primary" : "hover:bg-[rgba(0,0,0,0.02)]"}`}>
                    <input type="checkbox" checked={addonStick} onChange={(e) => setAddonStick(e.target.checked)} className="hidden" />
                    <span className="text-xl mr-4 opacity-70">🥁</span>
                    <span className="text-[#444] font-medium text-[15px] flex-1">드럼 스틱 대여</span>
                    <span className="text-danger font-bold text-[14px]">+ 2,000원</span>
                  </label>
                  <label className={`flex items-center p-4 border border-border cursor-pointer transition-colors ${addonDrink ? "bg-[rgba(6,214,160,0.05)] border-primary" : "hover:bg-[rgba(0,0,0,0.02)]"}`}>
                    <input type="checkbox" checked={addonDrink} onChange={(e) => setAddonDrink(e.target.checked)} className="hidden" />
                    <span className="text-xl mr-4 opacity-70">☕</span>
                    <span className="text-[#444] font-medium text-[15px] flex-1">음료 이용권</span>
                    <span className="text-danger font-bold text-[14px]">+ 3,000원</span>
                  </label>
                </div>
              </div>

              {/* 4. User Info */}
              <div className="border-t border-border pt-10">
                <label className="block text-black text-xs tracking-[2px] mb-6">4. 예약자 정보</label>
                <div className="flex flex-col gap-5">
                  <div>
                    <input
                      type="text" placeholder="예약자 성함" value={userName} onChange={e => setUserName(e.target.value)}
                      className="w-full bg-white border border-border text-black px-4 py-3 text-[15px] focus:border-primary focus:outline-none transition-colors font-medium placeholder-[#aaa]"
                    />
                  </div>
                  <div>
                    <input
                      type="tel" placeholder="연락처 (010-0000-0000)" value={userPhone} onChange={e => setUserPhone(e.target.value)}
                      className="w-full bg-white border border-border text-black px-4 py-3 text-[15px] focus:border-primary focus:outline-none transition-colors font-medium placeholder-[#aaa]"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Receipt Sidebar */}
            <div className="bg-white text-black p-8 shadow-xl sticky top-[120px] h-fit font-[monospace]">
              <div className="flex justify-between border-b border-dashed border-[#ccc] pb-4 mb-6">
                <span className="font-bold text-lg font-display text-primary">뽀롱뽀롱스튜디오</span>
                <span className="text-[#666]">결제 내역서</span>
              </div>
              <div className="flex flex-col gap-3 mb-6 border-b border-dashed border-[#ccc] pb-6">
                <div className="flex justify-between text-[15px] mb-2 text-[#444]">
                  <span>일정</span>
                  <span className="text-right">
                    {selectedDate ? `${selectedDate.getFullYear()}년 ${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일` : '날짜 미선택'}<br />
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
              <div className="flex justify-between items-end mb-6">
                <span className="text-[#444] font-bold">총 예상 금액</span>
                <span className="text-2xl font-bold">{total.toLocaleString()}원</span>
              </div>
              <p className="text-[13px] text-black text-center mb-6 leading-relaxed">
                * 현재 시스템은 예약 접수만 진행되며,<br />
                실제 결제는 방문 시 <strong>현장에서 진행</strong>해 주시면 됩니다.
              </p>
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4 animate-bounceUp">
          <div className="bg-white rounded-2xl border border-border p-10 max-w-[420px] w-full text-center relative shadow-2xl">
            <p className="text-5xl mb-4">🎉</p>
            <h2 className="text-secondary text-3xl mb-3 font-display">예약이 확정되었습니다!</h2>
            <p className="text-[#555] mb-8 text-[16px] leading-relaxed font-medium">
              {selectedDate?.getFullYear()}년 {selectedDate?.getMonth()! + 1}월 {selectedDate?.getDate()}일<br />
              {startTime} ~ {endTime} ({hours}시간)<br />
              <strong className="text-primary">{roomName}</strong> 예약이 완료되었습니다.
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
