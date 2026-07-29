"use client";

import { useMemo, useState } from "react";
import {
  BookOpen,
  Calendar,
  Clock,
  Home,
  MapPin,
  MessageCircle,
  User,
  Users,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import Chip from "@/components/ui/Chip";
import GlassCard from "@/components/ui/GlassCard";
import PageHeader from "@/components/ui/PageHeader";
import { getLevelBasePrice, getMaterialById } from "@/data/materials";
import { WHATSAPP_NUMBER } from "@/lib/constants";

const DAYS = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
] as const;

const TIME_OPTIONS = [
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
] as const;
const FULL_TIMES = new Set(["16:00"]);

const DURATION_OPTIONS = [
  { value: 60 as const, label: "60 menit", comingSoon: false },
  { value: 90 as const, label: "90 menit", comingSoon: false },
  { value: 120 as const, label: "2 jam", comingSoon: true },
];

const FREQUENCY_OPTIONS = [1, 2, 3, 4] as const;

const DEFAULT_DURATION = 90;
const DEFAULT_FREQUENCY = 3;
const DEFAULT_PARTICIPANTS = 1;

const LOCATION_FEE = {
  tentor: 0,
  siswa: 10000,
} as const;

export default function CourseConfigClient() {
  const searchParams = useSearchParams();

  const [duration, setDuration] = useState<60 | 90>(90);
  const [frequency, setFrequency] = useState<1 | 2 | 3 | 4>(3);
  const [participants, setParticipants] = useState<1 | 2 | 3>(1);
  const [location, setLocation] = useState<"tentor" | "siswa">("siswa");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [names, setNames] = useState<string[]>([""]);

  const materialId = searchParams.get("materi") || "";
  const programParam = searchParams.get("program") || "materi";
  const levelParam = searchParams.get("level") || "";
  const levelNumber = Number(levelParam);

  const material = getMaterialById(materialId);
  const selectedLevelData = material?.levels.find(
    (item) => item.level === levelNumber,
  );
  const isCalistungProgram = programParam === "calistung";
  const configSubjectLabel = isCalistungProgram ? "Program" : "Materi";
  const configSubjectValue = material?.name || "-";

  const durationMultiplier = duration === 90 ? 1.3 : 1;
  const participantMultiplier =
    participants === 1 ? 1 : participants === 2 ? 0.8 : 0.65;

  const estimatedPrice = useMemo(() => {
    if (!material || !selectedLevelData) return 0;
    const unitPrice = getLevelBasePrice(material, selectedLevelData.level);
    return Math.round(
      unitPrice * durationMultiplier * frequency * participantMultiplier +
        LOCATION_FEE[location],
    );
  }, [
    durationMultiplier,
    frequency,
    location,
    material,
    participantMultiplier,
    selectedLevelData,
  ]);

  const estimatedPriceLabel = useMemo(() => {
    return `Rp ${new Intl.NumberFormat("id-ID").format(estimatedPrice)} / minggu`;
  }, [estimatedPrice]);

  const isAllNamesFilled =
    names.length === participants &&
    names.every((name) => name.trim().length > 0);

  const isReadyToContinue =
    Boolean(material) &&
    Boolean(selectedLevelData) &&
    selectedDays.length > 0 &&
    Boolean(selectedTime) &&
    location === "siswa" &&
    isAllNamesFilled;

  const handleFrequencyChange = (nextFrequency: 1 | 2 | 3 | 4) => {
    setFrequency(nextFrequency);
    setSelectedDays((prev) => prev.slice(0, nextFrequency));
  };

  const handleParticipantsChange = (nextParticipants: 1 | 2 | 3) => {
    setParticipants(nextParticipants);
    setNames((prev) => {
      if (nextParticipants > prev.length) {
        return [
          ...prev,
          ...Array(nextParticipants - prev.length).fill(""),
        ];
      }
      return prev.slice(0, nextParticipants);
    });
  };

  const handleNameChange = (index: number, value: string) => {
    setNames((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleToggleDay = (day: string) => {
    setSelectedDays((prev) => {
      if (prev.includes(day)) {
        return prev.filter((item) => item !== day);
      }

      if (prev.length >= frequency) {
        return prev;
      }

      return [...prev, day];
    });
  };

  const handleContinueToWhatsApp = () => {
    if (!material || !selectedLevelData || !selectedTime) return;
    if (location !== "siswa") return;
    if (!isAllNamesFilled) return;

    const nameLines = names.map((name, index) => {
      const label = participants === 1 ? "Nama" : `Nama ${index + 1}`;
      return `• *${label}:* ${name.trim()}`;
    });

    const packageLines = [
      `• *${configSubjectLabel}:* ${configSubjectValue}`,
      ...(isCalistungProgram
        ? []
        : [
            `• *Level:* ${selectedLevelData.level} - ${selectedLevelData.title}`,
          ]),
      `• *Durasi:* ${duration} menit`,
      `• *Frekuensi:* ${frequency}x/minggu`,
      `• *Peserta:* ${participants} orang`,
      "• *Tempat:* Rumah Siswa",
    ];

    const message = [
      "Halo *Nurman Course* 👋",
      "Saya ingin lanjut pendaftaran les.",
      "",
      "*Data Pendaftar*",
      ...nameLines,
      "",
      "*Paket Belajar*",
      ...packageLines,
      "",
      "*Jadwal*",
      `• *Hari:* ${selectedDays.join(", ")}`,
      `• *Jam:* ${selectedTime}`,
      "",
      `*Estimasi:* ${estimatedPriceLabel}`,
      "",
      "Mohon info ketersediaan & langkah selanjutnya. Terima kasih 🙏",
    ].join("\n");

    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(waUrl, "_blank");
  };

  if (!material || !selectedLevelData) {
    return (
      <div className="pt-4 sm:pt-8">
        <PageHeader
          title="Atur Jadwal"
          subtitle="Sesuaikan waktu dan kebutuhan belajar"
        />

        <GlassCard className="p-6 sm:p-8">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Konfigurasi tidak valid
          </h1>
          <p className="text-gray-600">
            Materi atau level tidak ditemukan. Silakan kembali dan pilih materi
            lagi.
          </p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-44 pt-4 sm:space-y-6 sm:pt-8">
      <PageHeader
        title="Atur Jadwal"
        subtitle="Sesuaikan waktu dan kebutuhan belajar"
      />

      <GlassCard className="p-5 sm:p-6">
        <p className="text-sm font-semibold text-gray-900 sm:text-base">
          {configSubjectLabel}: {configSubjectValue}
        </p>
        {!isCalistungProgram && (
          <p className="mt-1 text-sm text-gray-600">
            Level {selectedLevelData.level} - {selectedLevelData.title}
          </p>
        )}
      </GlassCard>

      <GlassCard className="p-5 sm:p-6">
        <h2 className="mb-3 text-base font-bold text-gray-900 sm:text-lg">
          Durasi
        </h2>
        <div className="flex flex-wrap gap-2">
          {DURATION_OPTIONS.map((item) => {
            if (item.comingSoon) {
              return (
                <Chip
                  key={item.value}
                  onClick={() => undefined}
                  disabled
                  className="opacity-60"
                >
                  <span className="inline-flex items-center gap-1.5">
                    {item.label}
                    <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">
                      Coming Soon
                    </span>
                  </span>
                </Chip>
              );
            }

            return (
              <Chip
                key={item.value}
                label={item.label}
                active={duration === item.value}
                activeTone={
                  item.value === DEFAULT_DURATION ? "green" : "blue"
                }
                onClick={() => setDuration(item.value as 60 | 90)}
              />
            );
          })}
        </div>
      </GlassCard>

      <GlassCard className="p-5 sm:p-6">
        <h2 className="mb-3 text-base font-bold text-gray-900 sm:text-lg">
          Frekuensi
        </h2>
        <div className="flex flex-wrap gap-2">
          {FREQUENCY_OPTIONS.map((item) => (
            <Chip
              key={item}
              label={`${item}x / minggu`}
              active={frequency === item}
              activeTone={item === DEFAULT_FREQUENCY ? "green" : "blue"}
              onClick={() => handleFrequencyChange(item)}
            />
          ))}
        </div>
      </GlassCard>

      <GlassCard className="p-5 sm:p-6">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h2 className="text-base font-bold text-gray-900 sm:text-lg">
            <span className="inline-flex items-center gap-2">
              <Users size={18} strokeWidth={2.25} aria-hidden="true" />
              Jumlah Peserta
            </span>
          </h2>
          <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-[#4a70a9] sm:text-xs">
            {participants === 1
              ? "Harga penuh"
              : participants === 2
                ? "Diskon 20% / anak"
                : "Diskon 35% / anak"}
          </span>
        </div>
        <p className="mb-1 text-sm text-gray-500">
          Berapa orang dalam 1 kelas.
        </p>
        <p className="mb-3 text-sm text-gray-500">
          Estimasi harga dihitung{" "}
          <span className="font-medium text-gray-700">per anak .</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3].map((item) => (
            <Chip
              key={item}
              label={`${item} orang`}
              active={participants === item}
              activeTone={item === DEFAULT_PARTICIPANTS ? "green" : "blue"}
              onClick={() => handleParticipantsChange(item as 1 | 2 | 3)}
            />
          ))}
        </div>
      </GlassCard>

      <GlassCard className="p-5 sm:p-6">
        <div className="space-y-2">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-gray-800">
            <MapPin size={16} strokeWidth={2.25} aria-hidden="true" />
            Tempat Belajar
          </p>

          <div className="flex flex-wrap gap-2">
            <Chip onClick={() => undefined} disabled className="opacity-60">
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={16} strokeWidth={2.25} aria-hidden="true" />
                Tempat Tentor
                <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">
                  Coming Soon
                </span>
              </span>
            </Chip>

            <Chip
              active={location === "siswa"}
              activeTone="green"
              onClick={() => setLocation("siswa")}
            >
              <span className="inline-flex items-center gap-1.5">
                <Home size={16} strokeWidth={2.25} aria-hidden="true" />
                Rumah Siswa
              </span>
              <span className="ml-1 text-xs opacity-90">+10rb</span>
            </Chip>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-5 sm:p-6">
        <h2 className="mb-1 text-base font-bold text-gray-900 sm:text-lg">
          <span className="inline-flex items-center gap-2">
            <Calendar size={18} strokeWidth={2.25} aria-hidden="true" />
            Pilih Hari
          </span>
        </h2>
        <p className="mb-3 text-sm text-gray-500">
          Maksimal pilih {frequency} hari sesuai frekuensi.
        </p>
        <div className="flex flex-wrap gap-2">
          {DAYS.map((day) => (
            <Chip
              key={day}
              label={day}
              active={selectedDays.includes(day)}
              activeTone="blue"
              onClick={() => handleToggleDay(day)}
            />
          ))}
        </div>
      </GlassCard>

      <GlassCard className="p-5 sm:p-6">
        <h2 className="mb-1 text-base font-bold text-gray-900 sm:text-lg">
          <span className="inline-flex items-center gap-2">
            <Clock size={18} strokeWidth={2.25} aria-hidden="true" />
            Pilih Jam
          </span>
        </h2>
        <p className="mb-3 text-sm text-gray-500">
          Slot bertanda Full tidak bisa dipilih.
        </p>
        <div className="flex flex-wrap gap-2">
          {TIME_OPTIONS.map((time) => {
            const isFull = FULL_TIMES.has(time);

            return (
              <Chip
                key={time}
                label={isFull ? `${time} (Full)` : time}
                active={!isFull && selectedTime === time}
                activeTone="blue"
                onClick={() => {
                  if (isFull) return;
                  setSelectedTime(time);
                }}
                disabled={isFull}
              />
            );
          })}
        </div>
      </GlassCard>

      <GlassCard className="p-5 sm:p-6">
        <h2 className="mb-1 text-base font-bold text-gray-900 sm:text-lg">
          <span className="inline-flex items-center gap-2">
            <User size={18} strokeWidth={2.25} aria-hidden="true" />
            {participants === 1 ? "Nama Lengkap" : "Nama Peserta"}
          </span>
        </h2>
        <p className="mb-3 text-sm text-gray-500">
          Wajib diisi semua sebelum lanjut ke WhatsApp.
        </p>
        <div className="space-y-3">
          {names.map((name, index) => {
            const label =
              participants === 1 ? "Nama Lengkap" : `Nama ${index + 1}`;
            const placeholder =
              index === 0
                ? "Contoh: Budi Santoso"
                : `Nama peserta ke-${index + 1}`;

            return (
              <div key={index} className="space-y-1">
                {participants > 1 && (
                  <label className="text-xs font-semibold text-gray-700 sm:text-sm">
                    {label}
                  </label>
                )}
                <input
                  type="text"
                  name={`participant-name-${index + 1}`}
                  autoComplete="name"
                  value={name}
                  onChange={(event) =>
                    handleNameChange(index, event.target.value)
                  }
                  placeholder={placeholder}
                  className="w-full rounded-xl border border-white/70 bg-white/80 px-4 py-3 text-sm text-gray-900 shadow-sm outline-none placeholder:text-gray-400 focus:border-[#4a70a9] focus:ring-2 focus:ring-[#4a70a9]/25 sm:text-base"
                />
              </div>
            );
          })}
        </div>
      </GlassCard>

      <div className="fixed bottom-0 left-0 right-0 border-t border-white/70 bg-white/95 px-4 pb-5 pt-4 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 sm:text-base">
              <BookOpen
                size={16}
                strokeWidth={2.25}
                className="shrink-0 text-[#4a70a9]"
                aria-hidden="true"
              />
              <p className="truncate">
                {isCalistungProgram
                  ? material.name
                  : `${material.name} - Level ${selectedLevelData.level}`}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-600 sm:text-sm">
              <Clock
                size={14}
                strokeWidth={2.25}
                className="shrink-0 text-[#4a70a9]"
                aria-hidden="true"
              />
              <p className="truncate">
                {duration} menit - {frequency}x/minggu - {participants} orang
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-600 sm:text-sm">
              <MapPin
                size={14}
                strokeWidth={2.25}
                className="shrink-0 text-[#4a70a9]"
                aria-hidden="true"
              />
              <p className="truncate">Rumah Siswa</p>
            </div>
            <p className="mt-1 text-base font-bold text-[#4a70a9] sm:text-lg">
              Estimasi: {estimatedPriceLabel}
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={handleContinueToWhatsApp}
            disabled={!isReadyToContinue}
            className="inline-flex items-center gap-2 whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-50"
          >
            <MessageCircle size={18} strokeWidth={2.25} aria-hidden="true" />
            <span>Lanjut ke WhatsApp</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
