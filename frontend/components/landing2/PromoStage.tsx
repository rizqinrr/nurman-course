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
    const flMute = $("fl-mute");
    const flTxt = $("fl-mute-txt");
    const sp = typeof window !== "undefined" ? window.speechSynthesis : null;

    let AC: AudioContext | null = null;
    let mg: GainNode | null = null;
    let mute = true;
    let loopStartTime = Date.now();
    let tm: (ReturnType<typeof setTimeout> | ReturnType<typeof setInterval>)[] = [];

    const L = [
      "Pernah kepikiran bikin website sendiri?",
      "Halaman profil, portofolio, sampai toko kecil. Semuanya bisa dimulai dari nol.",
      "Di sini kamu belajar sambil praktik. Tulis, lihat hasilnya langsung, lalu perbaiki.",
      "Materinya berupa artikel pendek, dan progresmu tersimpan. Bisa lanjut kapan saja.",
      "Ikuti jalurnya, sampai websitemu benar-benar jadi.",
      "nCourse. Mulai belajar bikin website, gratis."
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

    function audio(fromSec = 0) {
      if (AC) {
        try { AC.close(); } catch {}
      }
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      AC = new AudioCtx();
      if (AC.state === "suspended") {
        AC.resume();
      }
      mg = AC.createGain();
      mg.gain.value = mute ? 0 : 1;
      mg.connect(AC.destination);

      const t0 = AC.currentTime + 0.08;
      const q = [262, 330, 392, 523, 392, 330, 294, 392];
      const startNoteIndex = Math.max(0, Math.floor(fromSec / 0.57));
      for (let i = startNoteIndex; i < 54; i++) {
        const noteTime = t0 + (i * 0.57) - fromSec;
        if (noteTime >= t0) {
          n(q[i % 8], noteTime, 0.5, "triangle", 0.05);
          if (i % 4 === 0) n(131, noteTime, 1.8, "sine", 0.06);
        }
      }
    }

    function fx(k: string) {
      if (!AC || mute) return;
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

    function updateMuteUI() {
      if (flMute) {
        flMute.classList.toggle("unmuted", !mute);
        flMute.setAttribute("aria-label", mute ? "Nyalakan suara" : "Matikan suara");
        if (flTxt) {
          flTxt.textContent = mute ? "Nyalakan suara" : "Suara nyala";
        }
      }
      if (mu) {
        mu.setAttribute("aria-pressed", String(!mute));
        mu.textContent = mute ? "🔇 Suara: mati" : "🔊 Suara: nyala";
      }
    }

    function toggleMute() {
      mute = !mute;
      updateMuteUI();

      if (!mute) {
        const elapsed = Math.max(0, (Date.now() - loopStartTime) / 1000);
        audio(elapsed);
      } else {
        if (mg) mg.gain.value = 0;
        if (sp) sp.cancel();
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
          if (done) done();
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
      loopStartTime = Date.now();
      if (po) po.classList.add("off");
      if (!mute) {
        audio(0);
      }
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
      at(32, () => {
        // Auto-Teaser continuous loop!
        play();
      });
    }

    if (go) {
      go.onclick = (e) => {
        e.stopPropagation();
        mute = false;
        updateMuteUI();
        play();
      };
    }
    if (rp) {
      rp.onclick = (e) => {
        e.stopPropagation();
        play();
      };
    }
    if (mu) {
      mu.onclick = (e) => {
        e.stopPropagation();
        toggleMute();
      };
    }
    if (flMute) {
      flMute.onclick = (e) => {
        e.stopPropagation();
        toggleMute();
      };
    }
    if (st) {
      st.onclick = () => {
        // If clicking on stage while muted, unmute!
        if (mute) {
          toggleMute();
        }
      };
    }

    // Auto-Teaser Motion: Play on mount (muted)
    updateMuteUI();
    play();

    return () => {
      reset();
      if (AC) {
        try { AC.close(); } catch {}
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="promo-original-wrap w-full flex flex-col items-center">
      {/* 9:16 Stage with exact original HTML */}
      <div className="stage cursor-pointer" id="st" title="Klik untuk bunyikan suara">
        {/* Floating Unmute Badge */}
        <button
          id="fl-mute"
          type="button"
          className="fl-mute"
          aria-label="Nyalakan suara"
          title="Nyalakan suara"
        >
          <span className="dot" />
          <span id="fl-mute-txt">Nyalakan suara</span>
        </button>

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
          <b>nCourse</b>
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
          <b>nCourse</b>
          <button id="go" aria-label="Putar video">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>

      {/* External Controls */}
      <div className="ctl">
        <button id="rp" aria-label="Ulangi video dari awal" title="Ulangi dari awal">
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
            <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
          </svg>
          <span>Ulangi</span>
        </button>
        <button id="mu" aria-pressed="false">🔇 Suara: mati</button>
      </div>
    </div>
  );
}
