"use client";

import { GraduationCap, MapPin, Star } from "lucide-react";
import { TUTOR_LOCATIONS } from "@/data/coverage";
import { tutors } from "@/data/landing";

export default function CoverageTutorList() {
  return (
    <section className="border-t-2 border-[#d9d2c2] bg-[#f7f5ef] py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="max-w-2xl">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#4a70a9]">
            Tim Pendidik Terlatih
          </span>
          <h2 className="mt-2 font-display text-3xl font-black text-[#14233a] sm:text-4xl">
            Tentor yang Siap Datang ke Rumah
          </h2>
          <p className="mt-2 text-sm text-[#50647a]">
            Tentor berlatar pendidikan jelas, komunikatif, dan terbiasa mendampingi anak dengan pendekatan personal yang sabar.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TUTOR_LOCATIONS.map((tutor) => {
            const profile = tutors.find((t) => t.nickname.includes(tutor.nickname) || tutor.nickname.includes(t.nickname));
            return (
              <div
                key={tutor.id}
                className="group flex flex-col justify-between rounded-2xl border-2 border-[#d9d2c2] bg-[#fffdf9] p-6 shadow-[0_12px_28px_-16px_rgba(27,48,77,0.18)] transition-all hover:-translate-y-1 hover:border-[#4a70a9]"
              >
                <div>
                  {/* Header info */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-[#2e4b7a] bg-[#2e4b7a] text-white font-black text-lg shadow-sm">
                        {tutor.nickname.slice(4, 5)}
                      </div>
                      <div>
                        <h3 className="font-display text-base font-black text-[#14233a]">
                          {tutor.nickname}
                        </h3>
                        <span className="font-mono text-xs font-semibold text-[#4a70a9]">
                          {tutor.role}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 rounded-md bg-[#fef3c7] px-2 py-0.5 text-xs font-bold text-[#92400e] border border-[#f59e0b]/30">
                      <Star className="h-3.5 w-3.5 fill-[#f59e0b] text-[#f59e0b]" />
                      <span>{tutor.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* University / Credential */}
                  {profile && (
                    <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#50647a] bg-[#f7f5ef] p-2.5 rounded-xl border border-[#e6dfd1]">
                      <GraduationCap className="h-4 w-4 text-[#2e4b7a] shrink-0" />
                      <span className="line-clamp-1">{profile.university} ({profile.major})</span>
                    </div>
                  )}

                  {/* Focus specialization */}
                  <p className="mt-4 text-xs leading-relaxed text-[#50647a]">
                    {tutor.specialization}
                  </p>
                </div>

                {/* Base location footer */}
                <div className="mt-6 border-t-2 border-[#e6dfd1] pt-4">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-[#203652]">
                      <MapPin className="h-3.5 w-3.5 text-[#4a70a9]" />
                      {tutor.baseLocation}
                    </span>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[0.68rem] font-bold text-emerald-800 border border-emerald-200">
                      Aktif Mengajar
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
