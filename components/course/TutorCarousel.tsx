"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

export interface Tutor {
  nickname: string;
  university: string;
  major: string;
  focus: string;
  photo: string;
}

const LOOP_SETS = 3;

interface TutorCarouselProps {
  tutors: Tutor[];
}

export default function TutorCarousel({ tutors }: TutorCarouselProps) {
  const n = tutors.length;
  const [activeTutorIndex, setActiveTutorIndex] = useState(0);
  const [loopedIndex, setLoopedIndex] = useState(n);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const isJumpingRef = useRef(false);
  const loopedIndexRef = useRef(n);

  const loopedTutors = useMemo(
    () =>
      Array.from({ length: LOOP_SETS }, (_, set) =>
        tutors.map((tutor, i) => ({
          ...tutor,
          key: `${set}-${tutor.nickname}`,
          logicalIndex: i,
        })),
      ).flat(),
    [tutors],
  );

  const scrollCardIntoView = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const track = trackRef.current;
      const card = cardRefs.current[index];
      if (!track || !card) return;

      const trackRect = track.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      const nextLeft =
        track.scrollLeft +
        (cardRect.left - trackRect.left) -
        (trackRect.width - cardRect.width) / 2;

      track.scrollTo({ left: nextLeft, behavior });
    },
    [],
  );

  const jumpToLoopedIndex = useCallback(
    (index: number) => {
      isJumpingRef.current = true;
      loopedIndexRef.current = index;
      setLoopedIndex(index);
      setActiveTutorIndex(((index % n) + n) % n);
      scrollCardIntoView(index, "auto");
      requestAnimationFrame(() => {
        isJumpingRef.current = false;
      });
    },
    [n, scrollCardIntoView],
  );

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      jumpToLoopedIndex(n);
    });
    return () => cancelAnimationFrame(id);
  }, [jumpToLoopedIndex, n]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || n === 0) return;

    let ticking = false;

    const sync = () => {
      if (isJumpingRef.current) return;

      const trackRect = track.getBoundingClientRect();
      const centerX = trackRect.left + trackRect.width / 2;

      let nearest = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;

      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const cardRect = card.getBoundingClientRect();
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const distance = Math.abs(cardCenterX - centerX);

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = index;
        }
      });

      loopedIndexRef.current = nearest;
      setLoopedIndex(nearest);
      setActiveTutorIndex(((nearest % n) + n) % n);

      if (nearest < n) {
        jumpToLoopedIndex(nearest + n);
        return;
      }

      if (nearest >= n * 2) {
        jumpToLoopedIndex(nearest - n);
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        sync();
        ticking = false;
      });
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", sync);

    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", sync);
    };
  }, [jumpToLoopedIndex, n]);

  const scrollToLogical = (logicalIndex: number) => {
    const target = n + logicalIndex;
    loopedIndexRef.current = target;
    setLoopedIndex(target);
    setActiveTutorIndex(logicalIndex);
    scrollCardIntoView(target, "smooth");
  };

  const handlePrev = () => {
    const nextLooped = loopedIndexRef.current - 1;
    if (nextLooped < 0) return;
    scrollCardIntoView(nextLooped, "smooth");
  };

  const handleNext = () => {
    const nextLooped = loopedIndexRef.current + 1;
    if (nextLooped >= loopedTutors.length) return;
    scrollCardIntoView(nextLooped, "smooth");
  };

  if (n === 0) return null;

  return (
    <section
      className="mt-12 sm:mt-14"
      aria-label="Tutor unggulan Nurman Course"
    >
      <div className="mb-4 flex items-end justify-between px-1">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4a70a9]/80">
            Tutor Unggulan
          </p>
          <h2 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
            Belajar bareng mentor favoritmu
          </h2>
        </div>

        <div className="hidden gap-2 sm:flex">
          <button
            type="button"
            onClick={handlePrev}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/70 text-[#4a70a9] shadow-md backdrop-blur-md transition hover:bg-white"
            aria-label="Tutor sebelumnya"
          >
            <ChevronLeft size={18} strokeWidth={2.25} />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/70 text-[#4a70a9] shadow-md backdrop-blur-md transition hover:bg-white"
            aria-label="Tutor berikutnya"
          >
            <ChevronRight size={18} strokeWidth={2.25} />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 pt-2 sm:px-2"
      >
        {loopedTutors.map((tutor, index) => {
          const isActive = index === loopedIndex;
          const offset = index - loopedIndex;

          return (
            <div
              key={tutor.key}
              ref={(element) => {
                cardRefs.current[index] = element;
              }}
              className={`snap-center shrink-0 basis-[82%] transition-all duration-500 sm:basis-[68%] ${
                isActive ? "scale-100 opacity-100" : "scale-[0.94] opacity-75"
              }`}
              style={{
                transform: `perspective(1200px) rotateY(${
                  offset === 0 ? 0 : offset < 0 ? 8 : -8
                }deg)`,
              }}
            >
              <GlassCard
                className={`h-full overflow-hidden p-4 sm:p-5 ${
                  isActive
                    ? "border-white/85 bg-white/78 shadow-[0_16px_34px_rgba(74,112,169,0.22)]"
                    : "border-white/70 bg-white/62"
                }`}
              >
                <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-white/70">
                  <Image
                    src={tutor.photo}
                    alt={tutor.nickname}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="mt-4 space-y-2">
                  <p className="text-xl font-bold text-gray-900">
                    {tutor.nickname}
                  </p>
                  <p className="text-sm font-semibold text-[#4a70a9]">
                    {tutor.major}
                  </p>
                  <p className="text-sm text-gray-700">
                    Lulusan {tutor.university}
                  </p>
                  <p className="text-sm text-gray-600">{tutor.focus}</p>
                </div>
              </GlassCard>
            </div>
          );
        })}
      </div>

      <div className="mt-1 flex items-center justify-center gap-2 sm:hidden">
        <button
          type="button"
          onClick={handlePrev}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/70 text-[#4a70a9] shadow-md"
          aria-label="Tutor sebelumnya"
        >
          <ChevronLeft size={16} strokeWidth={2.25} />
        </button>

        {tutors.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => scrollToLogical(index)}
            className={`h-2.5 rounded-full transition-all ${
              index === activeTutorIndex
                ? "w-6 bg-[#4a70a9]"
                : "w-2.5 bg-[#4a70a9]/35"
            }`}
            aria-label={`Lihat tutor ${index + 1}`}
          />
        ))}

        <button
          type="button"
          onClick={handleNext}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/70 text-[#4a70a9] shadow-md"
          aria-label="Tutor berikutnya"
        >
          <ChevronRight size={16} strokeWidth={2.25} />
        </button>
      </div>
    </section>
  );
}
