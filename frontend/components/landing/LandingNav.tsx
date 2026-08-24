"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

const NAV_LINKS = [
  { label: "Beranda", href: "#beranda" },
  { label: "Tentang Kami", href: "#tentang" },
  { label: "Program", href: "#program" },
  { label: "Materi", href: "/course/materi" },
  { label: "Jenjang", href: "/course/jenjang" },
  { label: "Calistung", href: "/course/calistung" },
  { label: "Testimoni", href: "#testimoni" },
];

const DODGE_RADIUS = 160;
const MAX_PUSH = 56;
const SCROLL_DURATION = 700;

function smoothScrollTo(targetY: number, reduceMotion: boolean) {
  const startY = window.scrollY;
  const distance = targetY - startY;

  if (reduceMotion || Math.abs(distance) < 2) {
    window.scrollTo(0, targetY);
    return;
  }

  const startTime = performance.now();

  const easeInOutCubic = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const step = (now: number) => {
    const progress = Math.min((now - startTime) / SCROLL_DURATION, 1);
    window.scrollTo(0, startY + distance * easeInOutCubic(progress));
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

const handleAnchorClick =
  (reduceMotion: boolean) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    const href = event.currentTarget.getAttribute("href");
    if (!href?.startsWith("#")) return;

    const target = document.getElementById(href.slice(1));
    if (!target) return;

    event.preventDefault();
    const offset = 88;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    smoothScrollTo(top, reduceMotion);
  };

export default function LandingNav() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const logoRef = useRef<HTMLAnchorElement | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 24 });
  const springY = useSpring(y, { stiffness: 260, damping: 24 });

  useEffect(() => {
    if (reduceMotion) return;

    let raf = 0;

    const handleMove = (event: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = logoRef.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = centerX - event.clientX;
        const dy = centerY - event.clientY;
        const distance = Math.hypot(dx, dy);

        if (distance >= DODGE_RADIUS) {
          x.set(0);
          y.set(0);
          return;
        }

        const push = MAX_PUSH * (1 - distance / DODGE_RADIUS);

        if (distance === 0) {
          x.set(push * 0.7);
          y.set(-push * 0.7);
          return;
        }

        x.set((dx / distance) * push);
        y.set((dy / distance) * push);
      });
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(raf);
    };
  }, [reduceMotion, x, y]);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-app-border bg-app-white/95 backdrop-blur-sm">
      <div className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-2.5 sm:px-6">
        <a
          href="#beranda"
          ref={logoRef}
          aria-label="Nurman Course, beranda"
          className="absolute left-3 top-0 z-10 block sm:left-5"
        >
          <motion.span
            style={{ x: springX, y: springY }}
            className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-app-border bg-[#2e4b7a] shadow-sm"
          >
            <Image
              src="/Nlogo.png"
              alt="Logo Nurman Course"
              width={72}
              height={72}
              className="h-[4.5rem] w-[4.5rem] rounded-full object-cover"
            />
          </motion.span>
        </a>

        <span className="ml-20 font-playfair text-xl tracking-tight text-app-text">
          Nurman{" "}
          <span className="font-playfair italic text-app-primary">
            Course
          </span>
        </span>

        <div className="hidden items-center gap-5 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={handleAnchorClick(reduceMotion ?? false)}
              className="text-sm font-semibold text-app-text-mid transition-colors hover:text-app-primary"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          <button
            type="button"
            onClick={() => router.push("/course/program")}
            className="inline-flex items-center gap-2 rounded-[6px] bg-app-primary px-5 py-2.5 text-sm font-semibold text-app-white transition-all hover:bg-app-secondary border border-app-primary/10 shadow-sm"
          >
            Mulai Belajar
          </button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-[6px] border border-app-border bg-app-white text-app-primary md:hidden"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
        >
          {open ? <X size={20} strokeWidth={2.25} /> : <Menu size={20} strokeWidth={2.25} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-app-border bg-app-white/95 px-4 py-3 backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-[6px] px-3 py-2.5 text-sm font-semibold text-app-text-mid transition-colors hover:bg-app-surface hover:text-app-primary"
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                router.push("/course/program");
              }}
              className="mt-2 inline-flex items-center justify-center rounded-[6px] bg-app-primary px-5 py-3 text-sm font-semibold text-app-white shadow-sm hover:bg-app-secondary"
            >
              Mulai Belajar
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
