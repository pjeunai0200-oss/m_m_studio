import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden bg-[#F0FAFF]">
        {/* Decorative background blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#FFD166] rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#06D6A0] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: "1.5s" }} />
        
        <div className="container relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left z-20 animate-bounceUp">
            <span className="eyebrow inline-block bg-accent text-white px-6 py-2 rounded-full text-lg font-bold tracking-widest shadow-md mb-6 transform -rotate-3 hover:rotate-0 transition-transform">
              WELCOME TO ADULT KIDCAFE!
            </span>
            <h1 className="giant-title mb-6 leading-tight">
              어른이들을 위한,<br />
              <span className="text-accent">드럼 키즈카페!</span>
            </h1>
            <p className="text-2xl text-[#1e293b] mb-10 font-medium">
              퇴근 후 스트레스?<br />동심으로 돌아가 신나게 두드려봐요!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/pricing" className="btn btn-primary text-xl">
                놀러가기 예약 🥁
              </Link>
              <Link href="/rooms" className="btn btn-outline text-xl">
                공간 둘러보기 🎈
              </Link>
            </div>
          </div>
          
          <div className="relative h-[250px] sm:h-[400px] md:h-[600px] w-full z-10 animate-float mt-8 md:mt-0">
            {/* Using the provided reference image */}
            <div className="absolute inset-0 bg-white rounded-full shadow-2xl overflow-hidden border-4 md:border-8 border-white transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <Image
                src="/adult_kidscafe_hero_1782866292142.png"
                alt="어른이 드럼 스튜디오"
                fill
                className="object-cover object-center"
                priority
              />
            </div>
            
            {/* Floating decoration images */}
            <div className="absolute -top-6 -right-6 md:-top-10 md:-right-10 w-24 h-24 md:w-40 md:h-40 bg-white rounded-3xl shadow-xl overflow-hidden border-2 md:border-4 border-white transform -rotate-12 animate-wiggle">
              <Image src="/adult_drum_pastel_1782866300088.png" alt="파스텔 드럼 세트" fill className="object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 md:-bottom-10 md:-left-10 w-28 h-28 md:w-48 md:h-48 bg-white rounded-full shadow-xl overflow-hidden border-2 md:border-4 border-white transform rotate-12 animate-wiggle" style={{ animationDelay: "0.5s" }}>
              <Image src="/adult_lounge_fun_1782866308733.png" alt="키즈카페 라운지" fill className="object-cover" />
            </div>
          </div>
        </div>
        
        {/* Wavy bottom border */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg className="relative block w-[calc(100%+1.3px)] h-[40px] md:h-[80px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,118.17,192.27,104.5Z" className="fill-white"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white relative">
        <div className="container">
          <div className="text-center mb-16 animate-bounceUp">
            <span className="eyebrow">OUR SPACES</span>
            <h2 className="giant-title-sm text-[#118AB2]">스트레스를 날려버릴 놀이 공간!</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="cute-card bg-[#FFF8E7] border-[#FFD166]">
              <div className="w-20 h-20 bg-[#FFD166] rounded-full flex items-center justify-center mb-6 shadow-md">
                <span className="text-4xl">🥁</span>
              </div>
              <h3 className="text-2xl font-bold text-[#1e293b] mb-4">파스텔 드럼방</h3>
              <p className="text-[#64748b] text-lg">마치 볼풀장 같은 푹신하고 귀여운 공간에서 눈치 보지 않고 프로페셔널하게 드럼을 연주하세요!</p>
            </div>
            
            <div className="cute-card bg-[#E6FAFC] border-[#06D6A0]">
              <div className="w-20 h-20 bg-[#06D6A0] rounded-full flex items-center justify-center mb-6 shadow-md">
                <span className="text-4xl">🎤</span>
              </div>
              <h3 className="text-2xl font-bold text-[#1e293b] mb-4">어른이 노래방</h3>
              <p className="text-[#64748b] text-lg">노래방 기기가 완비된 통통 튀는 무대에서 마음껏 소리 지르며 노래할 수 있어요.</p>
            </div>
            
            <div className="cute-card bg-[#FFF0F4] border-[#EF476F]">
              <div className="w-20 h-20 bg-[#EF476F] rounded-full flex items-center justify-center mb-6 shadow-md">
                <span className="text-4xl">🧸</span>
              </div>
              <h3 className="text-2xl font-bold text-[#1e293b] mb-4">키즈카페 라운지</h3>
              <p className="text-[#64748b] text-lg">어른 체격에 맞춘 커다란 빈백과 장난감들 속에서 동심으로 돌아가 힐링하는 라운지입니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Preview Section */}
      <section className="py-16 md:py-24 bg-[#F0FAFF] overflow-hidden">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="giant-title-sm text-[#EF476F]">찰칵! 어른이들의 놀이시간 📸</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="relative h-64 md:col-span-2 rounded-3xl overflow-hidden shadow-lg transform -rotate-1 hover:rotate-0 transition-transform">
              <Image src="/adult_drum_neon_1782866317922.png" alt="갤러리 1" fill className="object-cover" />
            </div>
            <div className="relative h-64 rounded-3xl overflow-hidden shadow-lg transform rotate-2 hover:rotate-0 transition-transform mt-4 md:mt-8">
              <Image src="/adult_drum_pastel_1782866300088.png" alt="갤러리 2" fill className="object-cover" />
            </div>
            <div className="relative h-64 rounded-3xl overflow-hidden shadow-lg transform -rotate-2 hover:rotate-0 transition-transform mt-4 md:mt-4">
              <Image src="/adult_lounge_fun_1782866308733.png" alt="갤러리 3" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-white text-center px-4">
        <div className="container max-w-3xl">
          <h2 className="giant-title-sm text-[#118AB2] mb-6">지친 일상 속 특별한<br/>나만의 놀이터를 만나보세요!</h2>
          <p className="text-xl text-[#64748b] mb-10">지금 예약하고 동심으로 돌아가 신나게 힐링하세요!</p>
          <Link href="/contact" className="btn bg-[#EF476F] text-white hover:bg-[#d63d63] text-2xl px-12 py-6">
            어른이 놀이터 예약하기 🚀
          </Link>
        </div>
      </section>
    </>
  );
}
