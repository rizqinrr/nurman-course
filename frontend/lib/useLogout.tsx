"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export function useLogout(options?: { message?: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState(false);

  const askLogout = () => setOpen(true);
  const cancelLogout = () => setOpen(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const logoutDialog = (
    <ConfirmDialog
      open={open}
      title="Keluar dari Akun?"
      message={
        options?.message ??
        "Kamu akan keluar dari portal Nurman Course. Pastikan semua pekerjaan sudah tersimpan."
      }
      confirmLabel="Ya, Keluar"
      cancelLabel="Batal"
      danger
      onConfirm={handleLogout}
      onCancel={cancelLogout}
    />
  );

  return { askLogout, cancelLogout, logoutDialog };
}
