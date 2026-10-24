"use client";

import { useEffect, useRef } from "react";
import { RotateCcw } from "lucide-react";

export default function FourStepsInteractive() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const R = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const $ = (id: string) => root.querySelector<HTMLElement>(`#${id}`);
    const lis = Array.from(root.querySelectorAll<HTMLElement>(".eds li"));
    const sx = Array.from(root.querySelectorAll<HTMLElement>(".sx"));

    const S = [0, 4, 8.5, 13];
    const D = [4, 4.5, 4.5, 5];
    const E = 18.5;

    const EV: [number, string, number | string][] = [
      [0, "", 0],
      [0.3, "r1", "show"],
      [1, "o1", "sel"],
      [1.4, "r2", "show"],
      [2.2, "o2", "sel"],
      [2.6, "r3", "show"],
      [3.4, "o3", "sel"],
      [4, "", 1],
      [5.6, "d2", "sel"],
      [6, "d4", "sel"],
      [6.5, "r5", "show"],
      [7, "r6", "show"],
      [8.5, "", 2],
      [9.1, "bb", "show"],
      [9.3, "p1", "show"],
      [9.8, "p2", "show"],
      [10.3, "p3", "show"],
      [10.8, "p4", "show"],
      [11.4, "snt", "show"],
      [11.9, "snt", "t2"],
      [12.4, "snt", "t3"],
      [13.3, "ty", "show"],
      [14.1, "ty", "gone"],
      [14.1, "b1", "show"],
      [14.6, "c1", "chk"],
      [15.1, "c2", "chk"],
      [15.6, "c3", "chk"],
      [16.2, "ty2", "show"],
      [17, "ty2", "gone"],
      [17, "a2", "show"],
    ];

    const AN: [number, number, (p: number) => void][] = [
      [
        4.4,
        5.4,
        function (p) {
          const el = $("nm");
          if (el) el.textContent = "Rafi".slice(0, Math.round(p * 4));
        },
      ],
      [
        7,
        8.2,
        function (p) {
          const el = $("rp1");
          if (el) {
            el.textContent =
              "Rp " +
              (Math.round(p * 44) * 5000).toLocaleString("id-ID");
          }
        },
      ],
    ];

    let el = 0;
    let last = 0;
    let run = false;
    let raf = 0;
    let fi: number[] = [];

    function scr(i: number) {
      sx.forEach((s, j) => {
        s.classList.toggle("on", j === i);
      });
    }

    function clear() {
      root
        ?.querySelectorAll(".show,.sel,.chk,.gone,.t2,.t3")
        .forEach((e) => {
          e.classList.remove("show", "sel", "chk", "gone", "t2", "t3");
        });
      const nm = $("nm");
      if (nm) nm.textContent = "";
      const rp1 = $("rp1");
      if (rp1) rp1.textContent = "Rp 0";
      root?.classList.remove("fin");
    }

    function paint() {
      lis.forEach((li, i) => {
        const a = S[i];
        const b = i < 3 ? S[i + 1] : E;
        const on = (el >= a && el < b) || (i === 3 && el >= E);
        li.classList.toggle("on", on);
        li.classList.toggle("dn", el >= b);
        li.style.setProperty(
          "--p",
          String(Math.max(0, Math.min(1, (el - a) / D[i])))
        );
        if (on) li.setAttribute("aria-current", "step");
        else li.removeAttribute("aria-current");
      });
    }

    function step() {
      EV.forEach((e, k) => {
        if (!fi[k] && el >= e[0]) {
          fi[k] = 1;
          if (typeof e[2] === "number") scr(e[2]);
          else $(e[1])?.classList.add(e[2]);
        }
      });
      AN.forEach((a) => {
        if (el >= a[0]) {
          a[2](Math.min(1, (el - a[0]) / (a[1] - a[0])));
        }
      });
      paint();
    }

    function tick(n: number) {
      if (!run) return;
      el += Math.min(n - last, 100) / 1000;
      last = n;
      if (el >= E) {
        fin();
        return;
      }
      step();
      raf = requestAnimationFrame(tick);
    }

    function seek(k: number) {
      if (R) {
        fin();
        return;
      }
      cancelAnimationFrame(raf);
      clear();
      scr(-1);
      if (k === 3) {
        scr(2);
        ["bb", "p1", "p2", "p3", "p4", "snt"].forEach((i) => {
          $(i)?.classList.add("show");
        });
        $("snt")?.classList.add("t2", "t3");
      }
      el = S[k];
      fi = EV.map((e) => (e[0] < S[k] ? 1 : 0));
      run = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }

    function fin() {
      run = false;
      cancelAnimationFrame(raf);
      clear();
      el = E;
      scr(2);
      sx[2]?.querySelectorAll(".rx").forEach((e) => {
        e.classList.add("show");
      });
      sx[2]?.querySelectorAll(".ty").forEach((e) => {
        e.classList.add("gone");
      });
      sx[2]?.querySelectorAll(".ck li").forEach((e) => {
        e.classList.add("chk");
      });
      $("snt")?.classList.add("t2", "t3");
      paint();
      root?.classList.add("fin");
    }

    lis.forEach((li, i) => {
      const btn = li.querySelector("button");
      if (btn) btn.onclick = () => seek(i);
    });

    const rpl = $("rpl");
    if (rpl) rpl.onclick = () => seek(0);

    let observer: IntersectionObserver | null = null;
    if (R || !("IntersectionObserver" in window)) {
      fin();
    } else {
      observer = new IntersectionObserver(
        (entries, obs) => {
          if (entries[0].isIntersecting) {
            obs.disconnect();
            seek(0);
          }
        },
        { threshold: 0.4 }
      );
      observer.observe(root);
    }

    return () => {
      cancelAnimationFrame(raf);
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <div className="four-steps-interactive w-full">
      <div className="mt-16 pt-12 border-t-2 border-[#d9d2c2]">
        <div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#14233a]">
            Empat langkah sampai anak mulai belajar
          </h2>
          <p className="text-sm sm:text-base text-[#50647a] mt-2 max-w-2xl">
            Dari memilih materi sampai tentor dikonfirmasi, semuanya lewat satu alur.
          </p>
        </div>

        <div className="ed" id="ed" ref={rootRef}>
          {/* Left Column: 4 Interactive Steps */}
          <ol className="eds">
            <li>
              <button type="button">
                <span className="no">1</span>
                <span>
                  <b>Pilih kebutuhan</b>
                  <em>Program, materi, dan level belajar anak.</em>
                </span>
              </button>
            </li>

            <li>
              <button type="button">
                <span className="no">2</span>
                <span>
                  <b>Atur jadwal dan biaya</b>
                  <em>Pilih hari dan sesi, estimasi biayanya transparan.</em>
                </span>
              </button>
            </li>

            <li>
              <button type="button">
                <span className="no">3</span>
                <span>
                  <b>Lanjut ke WhatsApp</b>
                  <em>Pesan pendaftaran terisi otomatis dan siap kirim.</em>
                </span>
              </button>
            </li>

            <li>
              <button type="button">
                <span className="no">4</span>
                <span>
                  <b>Kami carikan tentornya</b>
                  <em>
                    Kami cocokkan dengan mata pelajaran, jadwal tentor, dan lokasi, lalu kirim link konfirmasi ke portal wali lewat WhatsApp.
                  </em>
                </span>
              </button>
            </li>
          </ol>

          {/* Right Column: Animated Smartphone Simulation */}
          <div className="phw">
            <div className="phone" aria-hidden="true">
              <div className="scr">
                {/* Screen 1: Susun Pilihan Belajar */}
                <div className="sx on">
                  <h5>Susun pilihan belajar</h5>
                  <div className="rw rx" id="r1">
                    <small>Program</small>
                    <div className="chs">
                      <span>Calistung</span>
                      <span>Bimbel</span>
                      <span id="o1">Coding dan Web</span>
                    </div>
                  </div>
                  <div className="rw rx" id="r2">
                    <small>Materi</small>
                    <div className="op" id="o2">
                      Bikin Website Pertama dari Nol
                    </div>
                  </div>
                  <div className="rw rx" id="r3">
                    <small>Level</small>
                    <div className="op" id="o3">
                      Level 1: Dasar HTML dan Struktur Halaman
                    </div>
                  </div>
                </div>

                {/* Screen 2: Atur Jadwal */}
                <div className="sx">
                  <h5>Atur jadwal</h5>
                  <div className="rw">
                    <small>Nama</small>
                    <div className="op">
                      <span id="nm"></span>
                    </div>
                  </div>
                  <div className="rw">
                    <small>Hari</small>
                    <div className="chs">
                      <span>Sen</span>
                      <span id="d2">Sel</span>
                      <span>Rab</span>
                      <span id="d4">Kam</span>
                      <span>Jum</span>
                      <span>Sab</span>
                      <span>Min</span>
                    </div>
                  </div>
                  <div className="rw rx" id="r5">
                    <small>Sesi</small>
                    <div className="kv">
                      <span>Jam</span>
                      <b>19:30</b>
                      <span>Durasi</span>
                      <b>90 menit</b>
                      <span>Frekuensi</span>
                      <b>2x/minggu</b>
                      <span>Tempat</span>
                      <b>Rumah Siswa</b>
                    </div>
                  </div>
                  <div className="est rx" id="r6">
                    <small>Estimasi</small>
                    <div>
                      <b id="rp1">Rp 0</b> / minggu
                    </div>
                    <small style={{ margin: "1.5cqw 0 0" }}>
                      Contoh perhitungan
                    </small>
                  </div>
                </div>

                {/* Screen 3 & 4: WhatsApp UI */}
                <div className="sx wa">
                  <div className="wh">
                    <span className="av">N</span>
                    <div>
                      <b>nCourse</b>
                      <small>online</small>
                    </div>
                  </div>
                  <div className="wbody">
                    <div className="dt">Hari ini</div>

                    {/* Sent message from parent */}
                    <div className="me rx" id="bb">
                      <div className="rx" id="p1">
                        Halo <b>nCourse</b> 👋<br />
                        Saya ingin lanjut pendaftaran les.
                      </div>
                      <div className="rx" id="p2">
                        <b>Data Pendaftar</b>
                        <br />
                        Nama: Rafi
                      </div>
                      <div className="rx" id="p3">
                        <b>Paket Belajar</b>
                        <br />
                        Materi: Bikin Website Pertama dari Nol
                        <br />
                        Level 1, 90 menit, 2x/minggu
                        <br />
                        Tempat: Rumah Siswa
                      </div>
                      <div className="rx" id="p4">
                        <b>Jadwal</b>
                        <br />
                        Selasa, Kamis, 19:30
                        <br />
                        <b>Estimasi:</b> Rp 220.000 / minggu
                      </div>
                      <div className="mt rx" id="snt">
                        <span>09.41</span>
                        <svg
                          viewBox="0 0 16 11"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M1.5 6l3 3L10 2" />
                          <path className="b" d="M6 8.5l.7.5L14 2" />
                        </svg>
                      </div>
                    </div>

                    {/* Typing indicator 1 */}
                    <div className="ot ty rx" id="ty">
                      <i></i>
                      <i></i>
                      <i></i>
                    </div>

                    {/* Reply 1: Verification checklist */}
                    <div className="ot rx" id="b1">
                      <div>
                        <b>Pendaftaran diterima</b>
                        <br />
                        Kami cek dulu ya:
                      </div>
                      <ul className="ck">
                        <li id="c1">
                          <i></i>Mata pelajaran
                        </li>
                        <li id="c2">
                          <i></i>Jadwal tentor
                        </li>
                        <li id="c3">
                          <i></i>Lokasi
                        </li>
                      </ul>
                      <div className="mt">
                        <span>09.43</span>
                      </div>
                    </div>

                    {/* Typing indicator 2 */}
                    <div className="ot ty rx" id="ty2">
                      <i></i>
                      <i></i>
                      <i></i>
                    </div>

                    {/* Reply 2: Confirmation & Portal Link */}
                    <div className="ot rx" id="a2">
                      <div>Jadwal tersedia. Ini link konfirmasi portal wali.</div>
                      <span className="lk">
                        <b>Portal Wali nCourse</b>
                        <small>Konfirmasi pendaftaran</small>
                      </span>
                      <div className="mt">
                        <span>09.45</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Replay Button */}
            <button
              className="rpl"
              id="rpl"
              type="button"
              aria-label="Putar ulang simulasi pendaftaran"
              title="Putar ulang"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
