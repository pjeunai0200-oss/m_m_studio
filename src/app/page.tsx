import Image from "next/image";

export default function Home() {
  return (
    <section className="fixed inset-0 z-0">
      <Image
        src="/hero_drum_studio.png"
        alt="BEAT & VINYL 스튜디오 내부"
        fill
        className="object-cover object-center block"
        priority
      />
      <div className="absolute inset-0 bg-[rgba(10,10,10,0.28)]"></div>
    </section>
  );
}
