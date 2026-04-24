"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale } from "next-intl";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { getDirection, type AppLocale } from "@/i18n/routing";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const FRAMES_BASE_DESKTOP =
  process.env.NEXT_PUBLIC_HERO_FRAMES_BASE ??
  "/videos/hero-smoke-frames-1080p";
const FRAMES_BASE_MOBILE =
  process.env.NEXT_PUBLIC_HERO_FRAMES_BASE_MOBILE ??
  "/videos/hero-smoke-frames-720p";
const POSTER =
  process.env.NEXT_PUBLIC_HERO_POSTER_URL ?? "/videos/hero-smoke-poster.jpg";
const TOTAL_FRAMES = Number(process.env.NEXT_PUBLIC_HERO_FRAME_COUNT ?? "121");

const MOBILE_BREAKPOINT = 768;
const SECTION_HEIGHT = "100svh";
const SCRUB_END_SELECTOR = "#collection";

const frameUrl = (base: string, i: number) =>
  `${base}/frame-${String(i + 1).padStart(3, "0")}.jpg`;

export function HeroScrollScrub({ children }: { children: ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const indexRef = useRef(0);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const dir = getDirection(useLocale() as AppLocale);

  useEffect(() => {
    const setSize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    setSize();
    window.addEventListener("resize", setSize);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onMq = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onMq);
    return () => {
      window.removeEventListener("resize", setSize);
      mq.removeEventListener("change", onMq);
    };
  }, []);

  // Cover-fit + RTL flip + cross-fade between consecutive frames
  const draw = (exact: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const frames = framesRef.current;
    if (!canvas || !ctx || frames.length === 0) return;

    const i = Math.floor(exact);
    const blend = exact - i;
    const a = frames[i];
    const b = frames[i + 1];
    if (!a?.complete || a.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = a.naturalWidth;
    const ih = a.naturalHeight;
    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(a, dx, dy, dw, dh);
    if (b?.complete && b.naturalWidth > 0 && blend > 0) {
      ctx.globalAlpha = blend;
      ctx.drawImage(b, dx, dy, dw, dh);
      ctx.globalAlpha = 1;
    }
    indexRef.current = exact;
  };

  // Resize canvas to viewport (retina-aware)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      draw(indexRef.current);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Preload + decode all frames, then attach scrub
  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;
    let cancelled = false;
    let tween: gsap.core.Tween | undefined;

    // Show the poster as a temporary frame so the canvas isn't empty during preload
    const poster = new Image();
    poster.onload = () => {
      if (cancelled || framesRef.current.length > 1) return;
      framesRef.current = [poster];
      draw(0);
    };
    poster.src = POSTER;

    const base = isMobile ? FRAMES_BASE_MOBILE : FRAMES_BASE_DESKTOP;
    const frames: HTMLImageElement[] = [];
    const decodes: Promise<unknown>[] = [];
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const im = new Image();
      im.src = frameUrl(base, i);
      frames[i] = im;
      // .decode() forces the browser to fully decode the image off-thread, so
      // the first drawImage of each frame is instant rather than triggering
      // a synchronous decode on the render thread.
      decodes.push(im.decode().catch(() => {}));
    }

    Promise.all(decodes).then(() => {
      if (cancelled) return;
      framesRef.current = frames;
      draw(0);

      const endTrigger =
        document.querySelector<HTMLElement>(SCRUB_END_SELECTOR) ?? section;
      const state = { idx: 0 };
      tween = gsap.to(state, {
        idx: TOTAL_FRAMES - 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          endTrigger,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        onUpdate: () => draw(state.idx),
      });
    });

    return () => {
      cancelled = true;
      tween?.scrollTrigger?.kill();
      tween?.kill();
    };
  }, [isMobile, reducedMotion]);

  const overlayGradient =
    dir === "rtl"
      ? "linear-gradient(to left, rgba(10,10,10,0.7) 0%, rgba(10,10,10,0.25) 45%, transparent 75%)"
      : "linear-gradient(to right, rgba(10,10,10,0.7) 0%, rgba(10,10,10,0.25) 45%, transparent 75%)";

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ height: SECTION_HEIGHT }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden
        className="fixed inset-0 z-0 h-svh w-full bg-elevated"
      />
      <div className="relative z-10 h-svh">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          style={{ background: overlayGradient }}
        />
        <div className="relative z-10 h-full">{children}</div>
      </div>
    </section>
  );
}
