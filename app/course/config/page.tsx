"use client";

import { useMemo, useState } from "react";
import {
  BookOpen,
  Calendar,
  Clock,
  Home,
  MapPin,
  MessageCircle,
  Users,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import Chip from "@/components/ui/Chip";
import GlassCard from "@/components/ui/GlassCard";
import PageHeader from "@/components/ui/PageHeader";
import { getMaterialById } from "@/data/materials";
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

const FULL_DAYS = new Set(["Rabu", "Sabtu"]);
const TIME_OPTIONS = ["16:00", "18:00", "19:30"] as const;
const LOCATION_FEE = {
  tentor: 0,
  siswa: 10000,
} as const;

export default function CourseConfigPage() {
  const searchParams = useSearchParams();

  const [duration, setDuration] = useState<60 | 90>(60);
  const [frequency, setFrequency] = useState<1 | 2 | 3>(2);
  const [participants, setParticipants] = useState<1 | 2 | 3>(1);
  const [location, setLocation] = useState<"tentor" | "siswa">("tentor");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const materialId = searchParams.get("materi") || "";
  const programParam = searchParams.get("program") || "materi";
  const levelParam = searchParams.get("level") || "";
  const levelNumber = Number(levelParam);

  const material = getMaterialById(materialId);
  const selectedLevelData = material?.levels.find(
    (item) => item.level === levelNumber,
  );
  const configSubjectLabel =
    programParam === "calistung" ? "Program" : "Materi";
  const configSubjectValue =
    programParam === "calistung" ? "Calistung & Ngaji" : material?.name || "-";

  const durationMultiplier = duration === 90 ? 1.5 : 1;
  const participantMultiplier =
    participants === 1 ? 1 : participants === 2 ? 0.8 : 0.7;

  const estimatedPrice = useMemo(() => {
    if (!material) return 0;
    return Math.round(
      material.basePrice *
        durationMultiplier *
        frequency *
        participantMultiplier +
        LOCATION_FEE[location],
    );
  }, [
    durationMultiplier,
    frequency,
    location,
    material,
    participantMultiplier,
  ]);

  const estimatedPriceLabel = useMemo(() => {
    return `Rp ${new Intl.NumberFormat("id-ID").format(estimatedPrice)} / minggu`;
  }, [estimatedPrice]);

  const isReadyToContinue =
    Boolean(material) &&
    Boolean(selectedLevelData) &&
    selectedDays.length > 0 &&
    Boolean(selectedTime);

  const handleFrequencyChange = (nextFrequency: 1 | 2 | 3) => {
    setFrequency(nextFrequency);
    setSelectedDays((prev) => prev.slice(0, nextFrequency));
  };

  const handleToggleDay = (day: string) => {
    if (FULL_DAYS.has(day)) return;

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

    const message = [
      "Halo Nurman Course, saya ingin lanjut pendaftaran les dengan konfigurasi berikut:",
      `Materi: ${material.name}`,
      `Level: ${selectedLevelData.level} - ${selectedLevelData.title}`,
      `Durasi: ${duration} menit`,
      `Frekuensi: ${frequency}x/minggu`,
      `Peserta: ${participants} orang`,
      `Tempat: ${location === "tentor" ? "Tempat Tentor" : "Rumah Siswa"}`,
      `Hari: ${selectedDays.join(", ")}`,
      `Jam: ${selectedTime}`,
      `Estimasi harga: ${estimatedPriceLabel}`,
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
    <div className="space-y-5 pb-40 pt-4 sm:space-y-6 sm:pt-8">
      <PageHeader
        title="Atur Jadwal"
        subtitle="Sesuaikan waktu dan kebutuhan belajar"
      />

      <GlassCard className="p-5 sm:p-6">
        <p className="text-sm font-semibold text-gray-900 sm:text-base">
          {configSubjectLabel}: {configSubjectValue}
        </p>
        <p className="mt-1 text-sm text-gray-600">
          Level {selectedLevelData.level} - {selectedLevelData.title}
        </p>
      </GlassCard>

      <GlassCard className="p-5 sm:p-6">
        <h2 className="mb-3 text-base font-bold text-gray-900 sm:text-lg">
          Durasi
        </h2>
        <div className="flex flex-wrap gap-2">
          {[60, 90].map((item) => (
            <Chip
              key={item}
              label={`${item} menit`}
              active={duration === item}
              onClick={() => setDuration(item as 60 | 90)}
            />
          ))}
        </div>
      </GlassCard>

      <GlassCard className="p-5 sm:p-6">
        <h2 className="mb-3 text-base font-bold text-gray-900 sm:text-lg">
          Frekuensi
        </h2>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3].map((item) => (
            <Chip
              key={item}
              label={`${item}x / minggu`}
              active={frequency === item}
              onClick={() => handleFrequencyChange(item as 1 | 2 | 3)}
            />
          ))}
        </div>
      </GlassCard>

      <GlassCard className="p-5 sm:p-6">
        <h2 className="mb-3 text-base font-bold text-gray-900 sm:text-lg">
          <span className="inline-flex items-center gap-2">
            <Users size={18} strokeWidth={2.25} aria-hidden="true" />
            Jumlah Peserta
          </span>
        </h2>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3].map((item) => (
            <Chip
              key={item}
              label={`${item} orang`}
              active={participants === item}
              onClick={() => setParticipants(item as 1 | 2 | 3)}
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
            <Chip
              selected={location === "tentor"}
              onClick={() => setLocation("tentor")}
              className={`transition-all active:scale-95 flex items-center gap-1 whitespace-normal border ${
                location === "tentor"
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white/80 text-gray-700 border-gray-200"
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={16} strokeWidth={2.25} aria-hidden="true" />
                Tempat Tentor
              </span>
              <span className="text-xs opacity-80">Lebih hemat</span>
            </Chip>

            <Chip
              selected={location === "siswa"}
              onClick={() => setLocation("siswa")}
              className={`transition-all active:scale-95 flex items-center gap-1 whitespace-normal border ${
                location === "siswa"
                  ? "bg-[#4a70a9] text-white border-[#4a70a9]"
                  : "bg-white/80 text-gray-700 border-gray-200"
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                <Home size={16} strokeWidth={2.25} aria-hidden="true" />
                Rumah Siswa
              </span>
              <span className="text-xs opacity-80">+10rb (nyaman)</span>
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
          Hari bertanda penuh tidak bisa dipilih.
        </p>
        <p className="mb-3 text-sm text-gray-500">
          Maksimal pilih {frequency} hari sesuai frekuensi.
        </p>
        <div className="flex flex-wrap gap-2">
          {DAYS.map((day) => {
            const isFull = FULL_DAYS.has(day);

            return (
              <Chip
                key={day}
                label={isFull ? `${day} (Full)` : day}
                active={selectedDays.includes(day)}
                onClick={() => handleToggleDay(day)}
                disabled={isFull}
              />
            );
          })}
        </div>
      </GlassCard>

      <GlassCard className="p-5 sm:p-6">
        <h2 className="mb-3 text-base font-bold text-gray-900 sm:text-lg">
          <span className="inline-flex items-center gap-2">
            <Clock size={18} strokeWidth={2.25} aria-hidden="true" />
            Pilih Jam
          </span>
        </h2>
        <div className="flex flex-wrap gap-2">
          {TIME_OPTIONS.map((time) => (
            <Chip
              key={time}
              label={time}
              active={selectedTime === time}
              onClick={() => setSelectedTime(time)}
            />
          ))}
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
                {material.name} - Level {selectedLevelData.level}
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
              <p className="truncate">
                {location === "tentor" ? "Tempat Tentor" : "Rumah Siswa"}
              </p>
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
