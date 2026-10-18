"use client";

import { useEffect, useRef } from "react";

export default function PromoStage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const $ = (id: string) => root.querySelector<HTMLElement>(`#${id}`);
    const st = $("st");
    if (!st) return;

    const sc = Array.from(st.querySelectorAll<HTMLElement>(".sc"));
    const cap = $("cap");
    const po = $("po");
    const go = $("go");
    const rp = $("rp");
    const mu = $("mu");
    const sp = typeof window !== "undefined" ? window.speechSynthesis : null;

    let AC: AudioContext | null = null;
    let mg: GainNode | null = null;
    let mute = false;
    let tm: (ReturnType<typeof setTimeout> | ReturnType<typeof setInterval>)[] = [];

    const L = [
      "Pernah kepikiran bikin website sendiri?",
      "Halaman profil, portofolio, sampai toko kecil. Semuanya bisa dimulai dari nol.",
      "Di sini kamu belajar sambil praktik. Tulis, lihat hasilnya langsung, lalu perbaiki.",
      "Materinya berupa artikel pendek, dan progresmu tersimpan. Bisa lanjut kapan saja.",
      "Ikuti jalurnya, sampai websitemu benar-benar jadi.",
      "Nurman Course. Mulai belajar bikin website, gratis."
    ];
    const T = [0, 3, 8, 16, 21, 25];

    function n(f: number, t: number, d: number, ty: OscillatorType, g: number) {
      if (!AC || !mg) return;
      try {
        const o = AC.createOscillator();
        const v = AC.createGain();
        o.type = ty;
        o.frequency.value = f;
        v.gain.setValueAtTime(0, t);
        v.gain.linearRampToValueAtTime(g, t + 0.01);
        v.gain.exponentialRampToValueAtTime(0.0001, t + d);
        o.connect(v);
        v.connect(mg);
        o.start(t);
        o.stop(t + d + 0.05);
      } catch {}
    }

    function audio() {
      if (AC) {
        try { AC.close(); } catch {}
      }
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      AC = new AudioCtx();
      mg = AC.createGain();
      mg.gain.value = mute ? 0 : 1;
      mg.connect(AC.destination);

      const t0 = AC.currentTime + 0.1;
      const q = [262, 330, 392, 523, 392, 330, 294, 392];
      for (let i = 0; i < 54; i++) {
        n(q[i % 8], t0 + i * 0.57, 0.5, "triangle", 0.05);
        if (i % 4 === 0) n(131, t0 + i * 0.57, 1.8, "sine", 0.06);
      }
    }

    function fx(k: string) {
      if (!AC) return;
      const t = AC.currentTime;
      if (k === "pop") n(700, t, 0.14, "sine", 0.16);
      else if (k === "tick") n(1300, t, 0.035, "square", 0.025);
      else if (k === "done") {
        n(523, t, 0.3, "sine", 0.16);
        n(784, t + 0.1, 0.5, "sine", 0.16);
      } else if (k === "logo") {
        n(392, t, 0.9, "sine", 0.16);
        n(523, t + 0.12, 0.9, "sine", 0.16);
        n(659, t + 0.24, 1.2, "sine", 0.16);
      }
    }

    function at(s: number, f: () => void) {
      tm.push(setTimeout(f, s * 1000));
    }

    function typeInto(id: string, txt: string, done?: () => void) {
      const e = $(id);
      if (!e) return;
      let i = 0;
      const k = setInterval(() => {
        e.textContent = txt.slice(0, ++i);
        if (i % 3 === 0) fx("tick");
        if (i >= txt.length) {
          clearInterval(k);
          done && done();
        }
      }, 45);
      tm.push(k);
    }

    function scene(i: number) {
      sc.forEach((s, j) => {
        s.classList.toggle("on", j === i);
      });
      if (st) st.classList.toggle("dk", i === 5);
      if (cap) {
        cap.textContent = L[i];
        cap.classList.add("on");
      }
    }

    function reset() {
      tm.forEach((x) => {
        clearTimeout(x as ReturnType<typeof setTimeout>);
        clearInterval(x as ReturnType<typeof setInterval>);
      });
      tm = [];
      if (sp) sp.cancel();
      ["l1", "l2", "l3"].forEach((i) => {
        const el = $(i);
        if (el) el.textContent = "";
      });
      ["p1", "p2", "p3"].forEach((i) => {
        const el = $(i);
        if (el) el.classList.remove("on");
      });
      sc.forEach((s) => s.classList.remove("on"));
      if (cap) cap.classList.remove("on");
      if (st) st.classList.remove("dk");
    }

    function play() {
      reset();
      if (po) po.classList.add("off");
      audio();
      T.forEach((t, i) => {
        at(t, () => scene(i));
      });
      [3.3, 3.9, 4.5].forEach((t) => {
        at(t, () => fx("pop"));
      });
      at(8.5, () => {
        typeInto("l1", "<h1>Halo, ini websiteku</h1>", () => {
          $("p1")?.classList.add("on");
          fx("pop");
        });
      });
      at(10.6, () => {
        typeInto("l2", '<img src="foto.jpg">', () => {
          $("p2")?.classList.add("on");
          fx("pop");
        });
      });
      at(12.6, () => {
        typeInto("l3", "<button>Lihat karya</button>", () => {
          $("p3")?.classList.add("on");
          fx("pop");
        });
      });
      at(18.6, () => {
        fx("done");
      });
      [21.3, 22.2, 23.1, 24].forEach((t) => {
        at(t, () => fx("pop"));
      });
      at(25.2, () => {
        fx("logo");
      });
      at(31, () => {
        reset();
        if (po) po.classList.remove("off");
      });
    }

    if (go) go.onclick = play;
    if (rp) rp.onclick = play;
    if (mu) {
      mu.onclick = function () {
        mute = !mute;
        mu.setAttribute("aria-pressed", String(mute));
        mu.textContent = mute ? "Suara: mati" : "Suara: nyala";
        if (mg) mg.gain.value = mute ? 0 : 1;
        if (mute && sp) sp.cancel();
      };
    }

    return () => {
      reset();
      if (AC) {
        try { AC.close(); } catch {}
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="promo-original-wrap w-full flex flex-col items-center">
      <style jsx global>{`
        .promo-original-wrap {
          --pg: #E9EFEF;
          --fg: #243C4C;
          --bd: #C5D1D3;
        }
        .promo-original-wrap .stage {
          position: relative;
          overflow: hidden;
          container-type: size;
          width: min(calc(100vw - 32px), calc((100dvh - 190px) * 0.5625), 365px);
          aspect-ratio: 9/16;
          border-radius: 20px;
          background: #F7F9F8;
          color: #243C4C;
          box-shadow: 0 18px 40px -12px rgba(36, 60, 76, 0.22), 0 0 0 1px #D3DDDF;
        }
        .promo-original-wrap .stage.dk {
          background: #243C4C;
        }
        .promo-original-wrap .sc {
          position: absolute;
          inset: 0;
          display: none;
          padding: 9cqw 8cqw;
        }
        .promo-original-wrap .sc.on {
          display: block;
          animation: in-p .4s ease;
        }
        @keyframes in-p {
          from { opacity: 0; }
        }
        @keyframes up-p {
          from { opacity: 0; transform: translateY(3cqw); }
          to { opacity: 1; transform: none; }
        }
        @keyframes blink-p {
          50% { opacity: 0; }
        }
        @keyframes grow-p {
          from { transform: scaleY(0); }
          to { transform: none; }
        }
        @keyframes fillw-p {
          from { width: 62%; }
          to { width: 100%; }
        }
        .promo-original-wrap h1 {
          margin: 0;
          font-size: 12.5cqw;
          line-height: 1.1;
          font-weight: 700;
          letter-spacing: -.03em;
        }
        .promo-original-wrap .s0 .t {
          position: absolute;
          left: 8cqw;
          right: 8cqw;
          top: 50%;
          transform: translateY(-50%);
        }
        .promo-original-wrap .w {
          display: inline-block;
          opacity: 0;
          animation: up-p .5s forwards;
        }
        .promo-original-wrap .cur {
          display: inline-block;
          width: 1cqw;
          height: 11cqw;
          background: #3F7499;
          vertical-align: -1.5cqw;
          margin-left: 1.5cqw;
          animation: blink-p 1s steps(1) infinite;
        }
        .promo-original-wrap .h2 {
          font-size: 8cqw;
          font-weight: 700;
          letter-spacing: -.02em;
          line-height: 1.15;
          margin: 0;
        }
        .promo-original-wrap .mini {
          display: flex;
          align-items: center;
          gap: 4cqw;
          border: 1px solid #D3DDDF;
          background: #fff;
          border-radius: 3cqw;
          padding: 4cqw;
          margin-top: 4.5cqw;
          opacity: 0;
          animation: up-p .5s forwards;
        }
        .promo-original-wrap .art {
          display: flex;
          gap: 1.5cqw;
          width: 22cqw;
          height: 16cqw;
          flex: none;
        }
        .promo-original-wrap .art i {
          flex: 1;
          background: #D3DDDF;
          border-radius: 1.2cqw;
        }
        .promo-original-wrap .art i:first-child {
          background: #5289AD;
        }
        .promo-original-wrap .mini b {
          display: block;
          font-size: 6cqw;
        }
        .promo-original-wrap .mini span {
          font-size: 3.6cqw;
          color: #5C7787;
        }
        .promo-original-wrap .code {
          margin-top: 5cqw;
          background: #243C4C;
          color: #F7F9F8;
          border-radius: 3cqw;
          padding: 4cqw;
          font: 500 3.5cqw/1.9 ui-monospace, Menlo, Consolas, monospace;
          min-height: 28cqw;
        }
        .promo-original-wrap .code div {
          white-space: pre;
          min-height: 1.9em;
        }
        .promo-original-wrap .pv {
          margin-top: 5cqw;
          border: 1px solid #D3DDDF;
          background: #fff;
          border-radius: 3cqw;
          padding: 6cqw;
          display: grid;
          gap: 4cqw;
          justify-items: start;
        }
        .promo-original-wrap .pv > * {
          opacity: 0;
          transform: scale(.96);
        }
        .promo-original-wrap .pv > .on {
          opacity: 1;
          transform: none;
          transition: .4s;
        }
        .promo-original-wrap .pv h4 {
          margin: 0;
          font-size: 6.5cqw;
        }
        .promo-original-wrap .pv .ph {
          width: 100%;
          height: 34cqw;
          background: #D3DDDF;
          border-radius: 2cqw;
        }
        .promo-original-wrap .pv .bn {
          background: #3F7499;
          color: #fff;
          border-radius: 100px;
          padding: 2.5cqw 6cqw;
          font-size: 4.2cqw;
          font-weight: 600;
        }
        .promo-original-wrap .card {
          margin-top: 6cqw;
          border: 1px solid #D3DDDF;
          background: #fff;
          border-radius: 3cqw;
          padding: 6cqw;
        }
        .promo-original-wrap .cr {
          font-size: 3.4cqw;
          color: #5C7787;
          margin-bottom: 2cqw;
        }
        .promo-original-wrap .card h3 {
          margin: 0 0 4cqw;
          font-size: 6.2cqw;
        }
        .promo-original-wrap .toc {
          border-left: 2px solid #D3DDDF;
          padding-left: 3cqw;
          display: grid;
          gap: 2.5cqw;
          font-size: 3.8cqw;
          color: #5C7787;
          margin-bottom: 5cqw;
        }
        .promo-original-wrap .toc .a {
          color: #243C4C;
          font-weight: 600;
        }
        .promo-original-wrap .bar {
          height: 2cqw;
          background: #D3DDDF;
          border-radius: 2cqw;
          overflow: hidden;
          margin-bottom: 5cqw;
        }
        .promo-original-wrap .bar i {
          display: block;
          height: 100%;
          width: 62%;
          background: #5289AD;
          animation: fillw-p 1.5s 1s cubic-bezier(.3, .7, .2, 1) forwards;
        }
        .promo-original-wrap .bt {
          position: relative;
          display: inline-block;
          background: #3F7499;
          color: #fff;
          border-radius: 100px;
          padding: 2.5cqw 6cqw;
          font-size: 4.2cqw;
          font-weight: 600;
          animation: bg-p .3s 2.6s forwards;
        }
        .promo-original-wrap .bt .b2 {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          opacity: 0;
          animation: fi-p .3s 2.6s forwards;
        }
        .promo-original-wrap .bt .b1 {
          animation: fo-p .01s 2.6s forwards;
        }
        @keyframes bg-p { to { background: #243C4C; } }
        @keyframes fi-p { to { opacity: 1; } }
        @keyframes fo-p { to { opacity: 0; } }
        .promo-original-wrap .chip {
          display: inline-block;
          margin-top: 5cqw;
          border: 1px solid #15803D;
          color: #15803D;
          border-radius: 100px;
          padding: 1.2cqw 4cqw;
          font-size: 3.6cqw;
          font-weight: 500;
          opacity: 0;
          animation: up-p .4s 2.9s forwards;
        }
        .promo-original-wrap .pth {
          margin-top: 8cqw;
          position: relative;
          padding-left: 4cqw;
        }
        .promo-original-wrap .nd {
          display: flex;
          align-items: center;
          gap: 5cqw;
          padding: 4.5cqw 0;
          opacity: 0;
          animation: up-p .45s forwards;
          position: relative;
        }
        .promo-original-wrap .nd::before {
          content: "";
          flex: none;
          width: 7cqw;
          height: 7cqw;
          border-radius: 50%;
          border: 2px solid #3F7499;
          background: #fff;
        }
        .promo-original-wrap .nd::after {
          content: "";
          position: absolute;
          left: 3.2cqw;
          top: calc(50% + 3.5cqw);
          height: calc(100% - 0cqw);
          width: 2px;
          background: #3F7499;
          transform-origin: top;
          animation: grow-p .4s forwards;
        }
        .promo-original-wrap .nd:last-child::after {
          display: none;
        }
        .promo-original-wrap .nd span {
          font-size: 5.2cqw;
          font-weight: 600;
        }
        .promo-original-wrap .nd.f::before {
          background: #243C4C;
          border-color: #243C4C;
          width: 9cqw;
          height: 9cqw;
          margin: -1cqw;
        }
        .promo-original-wrap .s5 {
          display: none;
          text-align: center;
          color: #F7F9F8;
        }
        .promo-original-wrap .s5.on {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5cqw;
        }
        .promo-original-wrap .s5 svg {
          width: 24cqw;
          height: 24cqw;
          animation: up-p .6s both;
        }
        .promo-original-wrap .s5 b {
          font-size: 10cqw;
          letter-spacing: -.03em;
          animation: up-p .6s .3s both;
        }
        .promo-original-wrap .s5 p {
          margin: 0;
          font-size: 5cqw;
          color: #ACBCBF;
          animation: up-p .6s .6s both;
        }
        .promo-original-wrap .s5 .go {
          background: #5289AD;
          color: #0F1A22;
          border-radius: 100px;
          padding: 3cqw 8cqw;
          font-size: 5cqw;
          font-weight: 600;
          animation: up-p .6s 1s both;
        }
        .promo-original-wrap .cap {
          position: absolute;
          left: 6cqw;
          right: 6cqw;
          bottom: 7cqw;
          text-align: center;
          font-size: 4.2cqw;
          line-height: 1.35;
          font-weight: 500;
          background: rgba(247, 249, 248, .94);
          border: 1px solid #D3DDDF;
          border-radius: 3cqw;
          padding: 3cqw 4cqw;
          opacity: 0;
          transition: opacity .3s;
        }
        .promo-original-wrap .cap.on {
          opacity: 1;
        }
        .promo-original-wrap .stage.dk .cap {
          background: rgba(10, 19, 25, .8);
          color: #F7F9F8;
          border-color: #3A5163;
        }
        .promo-original-wrap .poster {
          position: absolute;
          inset: 0;
          background: #243C4C;
          color: #F7F9F8;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5cqw;
          z-index: 5;
        }
        .promo-original-wrap .poster.off {
          display: none;
        }
        .promo-original-wrap .poster svg {
          width: 22cqw;
          height: 22cqw;
        }
        .promo-original-wrap .poster b {
          font-size: 8cqw;
          letter-spacing: -.02em;
        }
        .promo-original-wrap .poster button {
          width: 20cqw;
          height: 20cqw;
          display: grid;
          place-items: center;
          background: #5289AD;
          color: #0F1A22;
          border: 0;
          border-radius: 50%;
          padding: 0;
          cursor: pointer;
          transition: background-color .4s ease;
        }
        .promo-original-wrap .poster button:hover {
          background: #78AACB;
        }
        .promo-original-wrap .poster button svg {
          width: 9cqw;
          height: 9cqw;
          margin-left: 1cqw;
        }
        .promo-original-wrap .ctl {
          display: flex;
          gap: 8px;
          margin-top: 14px;
        }
        .promo-original-wrap .ctl button {
          font: 500 14px inherit, system-ui, sans-serif;
          color: var(--fg);
          background: #ffffff;
          border: 1px solid var(--bd);
          border-radius: 100px;
          padding: 8px 18px;
          min-height: 40px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .promo-original-wrap .ctl button:hover {
          border-color: #5289AD;
        }
      `}</style>

      {/* 9:16 Stage with exact original HTML */}
      <div className="stage" id="st">
        {/* Scene 0 */}
        <div className="sc s0">
          <div className="t">
            <h1>
              <span className="w" style={{ animationDelay: ".2s" }}>Bikin</span>{" "}
              <span className="w" style={{ animationDelay: ".5s" }}>websitemu</span>{" "}
              <span className="w" style={{ animationDelay: ".8s" }}>sendiri</span>
              <span className="cur"></span>
            </h1>
          </div>
        </div>

        {/* Scene 1 */}
        <div className="sc s1">
          <p className="h2" style={{ marginTop: "6cqw" }}>Dari nol.</p>
          <div className="mini" style={{ animationDelay: ".3s" }}>
            <div className="art"><i></i><i></i></div>
            <div><b>Profil</b><span>Perkenalkan dirimu</span></div>
          </div>
          <div className="mini" style={{ animationDelay: ".9s" }}>
            <div className="art"><i></i><i></i><i></i></div>
            <div><b>Portofolio</b><span>Pamerkan karyamu</span></div>
          </div>
          <div className="mini" style={{ animationDelay: "1.5s" }}>
            <div className="art"><i></i><i></i><i></i><i></i></div>
            <div><b>Toko kecil</b><span>Jual hasil buatanmu</span></div>
          </div>
        </div>

        {/* Scene 2 */}
        <div className="sc s2">
          <p className="h2" style={{ marginTop: "4cqw" }}>Tulis. Lihat. Perbaiki.</p>
          <div className="code">
            <div id="l1"></div>
            <div id="l2"></div>
            <div id="l3"></div>
          </div>
          <div className="pv">
            <h4 id="p1">Halo, ini websiteku</h4>
            <div className="ph" id="p2"></div>
            <span className="bn" id="p3">Lihat karya</span>
          </div>
        </div>

        {/* Scene 3 */}
        <div className="sc s3">
          <p className="h2" style={{ marginTop: "4cqw" }}>Progres tersimpan.</p>
          <div className="card">
            <div className="cr">Materi / Bikin website pertamamu</div>
            <h3>Membuat halaman pertamamu</h3>
            <div className="toc">
              <span>Menyiapkan file</span>
              <span className="a">Menulis judul dan teks</span>
              <span>Menambah gambar</span>
            </div>
            <div className="bar"><i></i></div>
            <span className="bt">
              <span className="b1">Tandai selesai</span>
              <span className="b2">Selesai</span>
            </span>
          </div>
          <span className="chip">Progres tersimpan</span>
        </div>

        {/* Scene 4 */}
        <div className="sc s4">
          <p className="h2" style={{ marginTop: "4cqw" }}>Ikuti jalurnya.</p>
          <div className="pth">
            <div className="nd" style={{ animationDelay: ".3s" }}>
              <span>Menyiapkan halaman</span>
            </div>
            <div className="nd" style={{ animationDelay: "1.2s" }}>
              <span>Teks dan gambar</span>
            </div>
            <div className="nd" style={{ animationDelay: "2.1s" }}>
              <span>Warna dan tata letak</span>
            </div>
            <div className="nd f" style={{ animationDelay: "3s" }}>
              <span>Website jadi</span>
            </div>
          </div>
        </div>

        {/* Scene 5 */}
        <div className="sc s5">
          <svg viewBox="0 0 32 32">
            <rect width="32" height="32" rx="7" fill="#F7F9F8" />
            <polygon points="16,4.5 28,9.5 16,14.5 4,9.5" fill="#698696" />
            <path d="M9.5 27V17l13 10V17" fill="none" stroke="#243C4C" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
          <b>Nurman Course</b>
          <p>Belajar bikin website</p>
          <span className="go">Mulai gratis</span>
        </div>

        {/* Caption */}
        <div className="cap" id="cap"></div>

        {/* Poster */}
        <div className="poster" id="po">
          <svg viewBox="0 0 32 32">
            <rect width="32" height="32" rx="7" fill="#F7F9F8" />
            <polygon points="16,4.5 28,9.5 16,14.5 4,9.5" fill="#698696" />
            <path d="M9.5 27V17l13 10V17" fill="none" stroke="#243C4C" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
          <b>Nurman Course</b>
          <button id="go" aria-label="Putar video">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>

      {/* External Controls */}
      <div className="ctl">
        <button id="rp" aria-label="Putar video" title="Putar">
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
            <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
          </svg>
          <span>Ulangi</span>
        </button>
        <button id="mu" aria-pressed="false">Suara: nyala</button>
      </div>
    </div>
  );
}
