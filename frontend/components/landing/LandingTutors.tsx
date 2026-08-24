"use client";

import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { tutors } from "@/data/landing";

const LOOP_SETS = 3;

export default function LandingTutors() {
  const n = tutors.length;
  const [activeTutorIndex, setActiveTutorIndex] = useState(0);
  const [loopedIndex, setLoopedIndex] = useState(n);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const isJumpingRef = useRef(false);
  const loopedIndexRef = useRef(n);
  const reduceMotion = useReducedMotion();

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
      id="tutor"
      className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20"
      aria-label="Tutor Unggulan Nurman Course"
    >
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-app-primary">
            Tutor Unggulan
          </p>
          <h2 className="mt-2 font-playfair text-3xl font-normal tracking-tight text-app-text sm:text-4xl">
            Belajar bareng mentor favoritmu
          </h2>
        </div>

        <div className="hidden gap-2 sm:flex">
          <button
            type="button"
            onClick={handlePrev}
            className="inline-flex h-10 w-10 items-center justify-center rounded-[6px] border border-app-border bg-app-white text-app-primary transition hover:bg-app-surface shadow-sm"
            aria-label="Tutor sebelumnya"
          >
            <ChevronLeft size={18} strokeWidth={2.25} />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex h-10 w-10 items-center justify-center rounded-[6px] border border-app-border bg-app-white text-app-primary transition hover:bg-app-surface shadow-sm"
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
              className={`snap-center shrink-0 basis-[85%] transition-all duration-500 sm:basis-[31%] ${
                isActive ? "scale-100 opacity-100" : "scale-[0.96] opacity-75"
              }`}
              style={{
                transform: `perspective(1200px) rotateY(${
                  offset === 0 ? 0 : offset < 0 ? 6 : -6
                }deg)`,
              }}
            >
              <div
                className={`h-full overflow-hidden p-4 sm:p-5 rounded-2xl border transition-all duration-300 ${
                  isActive
                    ? "border-app-primary bg-app-white shadow-sm"
                    : "border-app-border bg-app-surface"
                }`}
              >
                <div className="relative h-56 w-full overflow-hidden rounded-2xl border border-app-border bg-app-bg">
                  <Image
                    src={tutor.photo}
                    alt={tutor.nickname}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="mt-4 space-y-2">
                  <p className="font-playfair text-xl font-normal text-app-text">
                    {tutor.nickname}
                  </p>
                  <p className="text-sm font-semibold text-app-primary">
                    {tutor.major}
                  </p>
                  <p className="text-sm text-app-text-mid">
                    Lulusan {tutor.university}
                  </p>
                  <p className="text-sm text-app-text-muted">{tutor.focus}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 sm:hidden">
        <button
          type="button"
          onClick={handlePrev}
          className="inline-flex h-9 w-9 items-center justify-center rounded-[6px] border border-app-border bg-app-white text-app-primary shadow-sm"
          aria-label="Tutor sebelumnya"
        >
          <ChevronLeft size={16} strokeWidth={2.25} />
        </button>

        {tutors.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => scrollToLogical(index)}
            className={`h-2 rounded-[2px] transition-all ${
              index === activeTutorIndex
                ? "w-6 bg-app-primary"
                : "w-2.5 bg-app-primary/30"
            }`}
            aria-label={`Lihat tutor ${index + 1}`}
          />
        ))}

        <button
          type="button"
          onClick={handleNext}
          className="inline-flex h-9 w-9 items-center justify-center rounded-[6px] border border-app-border bg-app-white text-app-primary shadow-sm"
          aria-label="Tutor berikutnya"
        >
          <ChevronRight size={16} strokeWidth={2.25} />
        </button>
      </div>
    </section>
  );
}