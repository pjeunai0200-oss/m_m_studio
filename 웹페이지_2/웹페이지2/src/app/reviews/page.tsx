"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";

interface Review {
  id: string;
  created_at: string;
  author_name: string;
  content: string;
  rating: number;
  image_url: string | null;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Form states
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (err: any) {
      console.error("Error fetching reviews:", err.message);
      setErrorMsg("아직 후기 시스템이 설정되지 않았거나 에러가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !content.trim()) return;

    setIsSubmitting(true);
    try {
      let imageUrl = null;

      // 1. Upload image if exists
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('reviews')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('reviews').getPublicUrl(filePath);
        imageUrl = data.publicUrl;
      }

      // 2. Insert review
      const { error } = await supabase
        .from('reviews')
        .insert([
          {
            author_name: authorName,
            content: content,
            rating: rating,
            image_url: imageUrl
          }
        ]);

      if (error) throw error;

      // Reset and refresh
      setShowModal(false);
      setAuthorName("");
      setContent("");
      setRating(5);
      setImageFile(null);
      fetchReviews();

    } catch (err: any) {
      alert("후기 등록에 실패했습니다. (Storage 설정 등을 확인해주세요!)\n" + err.message);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="page-header-band">
        <div className="container">
          <span className="eyebrow">REVIEWS</span>
          <h1 className="giant-title">이용 후기</h1>
          <p className="page-header-desc">여러분의 소중한 추억을 공유해주세요!</p>
        </div>
      </div>

      <section className="py-20 bg-background">
        <div className="container max-w-[1200px]">
          
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-2xl font-bold text-secondary">최근 올라온 후기</h2>
            <button 
              onClick={() => setShowModal(true)}
              className="btn btn-primary"
            >
              ✎ 후기 남기기
            </button>
          </div>

          {errorMsg && (
            <div className="bg-[#FFF3CD] text-[#856404] p-4 rounded-xl mb-8 text-center font-bold">
              {errorMsg}
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-20 text-[#aaa]">후기를 불러오는 중...</div>
          ) : reviews.length === 0 && !errorMsg ? (
            <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-[#ccc]">
              <p className="text-5xl mb-4">📸</p>
              <p className="text-xl font-bold text-[#666]">아직 등록된 후기가 없어요.</p>
              <p className="text-[#888] mt-2">첫 번째 후기의 주인공이 되어보세요!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-3xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
                  {review.image_url && (
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-[#f5f5f5]">
                      <img src={review.image_url} alt="Review" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-bold text-lg text-secondary">{review.author_name}</span>
                    <span className="text-accent text-lg">{"★".repeat(review.rating)}{"☆".repeat(5-review.rating)}</span>
                  </div>
                  <p className="text-[#555] whitespace-pre-wrap leading-relaxed text-[15px]">
                    {review.content}
                  </p>
                  <div className="text-right mt-4 text-[#aaa] text-sm">
                    {new Date(review.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Write Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4 animate-bounceUp">
          <div className="bg-white rounded-3xl border border-border p-8 max-w-[500px] w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-2xl text-[#aaa] hover:text-black transition-colors"
            >
              ✕
            </button>
            
            <h2 className="text-2xl font-bold text-secondary mb-6">후기 남기기</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-[#666] text-[13px] mb-2 font-bold">이름 *</label>
                <input 
                  type="text" 
                  required
                  value={authorName}
                  onChange={e => setAuthorName(e.target.value)}
                  className="w-full bg-[#f8f9fa] border border-border text-black px-4 py-3 rounded-xl focus:border-primary focus:outline-none transition-colors"
                  placeholder="홍길동"
                />
              </div>

              <div>
                <label className="block text-[#666] text-[13px] mb-2 font-bold">별점</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(star => (
                    <button 
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-3xl transition-transform hover:scale-110 ${star <= rating ? 'text-accent' : 'text-[#ddd]'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[#666] text-[13px] mb-2 font-bold">사진 첨부 (선택)</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={e => setImageFile(e.target.files?.[0] || null)}
                  className="w-full bg-[#f8f9fa] border border-border text-black px-4 py-3 rounded-xl focus:border-primary focus:outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-[#05b88a]"
                />
              </div>

              <div>
                <label className="block text-[#666] text-[13px] mb-2 font-bold">내용 *</label>
                <textarea 
                  required
                  rows={4}
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full bg-[#f8f9fa] border border-border text-black px-4 py-3 rounded-xl focus:border-primary focus:outline-none transition-colors resize-y"
                  placeholder="즐거웠던 추억을 남겨주세요!"
                />
              </div>

              <div className="flex gap-3 mt-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 rounded-xl font-bold bg-[#f1f1f1] text-[#666] hover:bg-[#e1e1e1] transition-colors"
                >
                  취소
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-4 rounded-xl font-bold bg-primary text-white hover:bg-[#05b88a] transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "업로드 중..." : "등록하기"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </>
  );
}
