/* Hallmark · genre: playful-glassmorphism · design-system: design.md · designed-as-app */
"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Plus, Landmark, Trash2, Check, XCircle, Star } from "lucide-react";
import { createPaymentAccountSchema } from "@nurman-course/shared";
import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";
import PageHeader from "@/components/ui/PageHeader";
import { apiFetch } from "@/lib/api";

interface PaymentAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  isActive: boolean;
  isDefault: boolean;
  note?: string | null;
  createdAt: string;
}

interface AccountForm {
  bankName: string;
  accountNumber: string;
  accountName: string;
  isActive: boolean;
  isDefault: boolean;
  note: string;
}

const emptyForm: AccountForm = {
  bankName: "",
  accountNumber: "",
  accountName: "",
  isActive: true,
  isDefault: false,
  note: "",
};

function toForm(account: PaymentAccount): AccountForm {
  return {
    bankName: account.bankName,
    accountNumber: account.accountNumber,
    accountName: account.accountName,
    isActive: account.isActive,
    isDefault: account.isDefault,
    note: account.note || "",
  };
}

export default function AdminRekeningPage() {
  const [accounts, setAccounts] = useState<PaymentAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [editingAccount, setEditingAccount] = useState<PaymentAccount | null>(null);
  const [form, setForm] = useState<AccountForm>(emptyForm);

  const loadAccounts = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await apiFetch<{ data: PaymentAccount[] }>("/api/admin/payment-accounts");
      setAccounts(response.data || []);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal memuat rekening.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadAccounts();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadAccounts]);

  const resetForm = () => {
    setEditingAccount(null);
    setForm(emptyForm);
    setErrorMessage(null);
  };

  const handleEdit = (account: PaymentAccount) => {
    setEditingAccount(account);
    setForm(toForm(account));
    setNotice(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setNotice(null);

    const parsed = createPaymentAccountSchema.safeParse(form);

    if (!parsed.success) {
      setErrorMessage(parsed.error.issues[0]?.message || "Data rekening belum valid.");
      return;
    }

    setSaving(true);
    try {
      const path = editingAccount ? `/api/admin/payment-accounts/${editingAccount.id}` : "/api/admin/payment-accounts";
      const method = editingAccount ? "PATCH" : "POST";
      await apiFetch<{ data: PaymentAccount }>(path, {
        method,
        body: JSON.stringify(parsed.data),
      });
      setNotice(editingAccount ? "Rekening berhasil diperbarui." : "Rekening berhasil ditambahkan.");
      resetForm();
      await loadAccounts();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menyimpan rekening.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (account: PaymentAccount) => {
    if (!window.confirm(`Hapus rekening ${account.bankName} ${account.accountNumber}?`)) return;
    setErrorMessage(null);
    setNotice(null);

    try {
      await apiFetch(`/api/admin/payment-accounts/${account.id}`, { method: "DELETE" });
      setNotice("Rekening berhasil dihapus.");
      if (editingAccount?.id === account.id) resetForm();
      await loadAccounts();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menghapus rekening.");
    }
  };

  const handleSetDefault = async (account: PaymentAccount) => {
    if (account.isDefault) return;
    setErrorMessage(null);
    setNotice(null);

    try {
      await apiFetch(`/api/admin/payment-accounts/${account.id}`, {
        method: "PATCH",
        body: JSON.stringify({ isDefault: true }),
      });
      setNotice(`Rekening ${account.bankName} kini menjadi default.`);
      await loadAccounts();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal mengubah rekening default.");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full flex-grow flex flex-col gap-6">
      <PageHeader
        title="Rekening Bank"
        subtitle="Kelola rekening tujuan transfer yang ditampilkan ke wali murid."
        showBack={false}
      />

      {errorMessage && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {errorMessage}
        </div>
      )}
      {notice && (
        <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {notice}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="flex flex-col gap-4">
          {loading ? (
            <GlassCard className="p-8 text-center text-sm font-medium text-gray-600">Memuat daftar rekening...</GlassCard>
          ) : accounts.length === 0 ? (
            <GlassCard className="p-8 text-center">
              <Landmark size={28} className="mx-auto text-gray-400" />
              <h2 className="mt-3 font-bold text-gray-800">Belum ada rekening</h2>
              <p className="mt-1 text-sm text-gray-500">Tambahkan rekening tujuan transfer dari form di samping.</p>
            </GlassCard>
          ) : (
            <div className="grid gap-4">
              {accounts.map((account) => (
                <GlassCard key={account.id} className="p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#4a70a9]/15 text-[#4a70a9]">
                        <Landmark size={22} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-lg font-bold text-gray-800">{account.bankName}</h2>
                          {account.isDefault && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase text-amber-700">
                              <Star size={10} fill="currentColor" /> Default
                            </span>
                          )}
                          {!account.isActive && (
                            <span className="rounded-full bg-gray-200 px-2.5 py-1 text-[10px] font-bold uppercase text-gray-600">Nonaktif</span>
                          )}
                        </div>
                        <p className="mt-1 text-base font-mono font-bold tracking-wide text-[#4a70a9]">{account.accountNumber}</p>
                        <p className="text-xs text-gray-500">a/n {account.accountName}{account.note ? ` · ${account.note}` : ""}</p>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2">
                      {!account.isDefault && account.isActive && (
                        <button
                          type="button"
                          onClick={() => void handleSetDefault(account)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 ring-1 ring-amber-200 hover:bg-amber-100"
                        >
                          <Star size={14} /> Jadikan Default
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleEdit(account)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-white/70 px-3 py-2 text-xs font-bold text-gray-700 ring-1 ring-gray-200 hover:bg-white"
                      >
                        <Check size={14} /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(account)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600 ring-1 ring-red-100 hover:bg-red-100"
                      >
                        <Trash2 size={14} /> Hapus
                      </button>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </section>

        <GlassCard className="h-fit p-5 xl:sticky xl:top-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-gray-800">{editingAccount ? "Edit Rekening" : "Rekening Baru"}</h2>
              <p className="mt-1 text-xs text-gray-500">Rekening ini tampil untuk wali saat transfer.</p>
            </div>
            {editingAccount && (
              <button type="button" onClick={resetForm} className="rounded-lg p-2 text-gray-400 hover:bg-white/70 hover:text-gray-700" aria-label="Batal edit">
                <XCircle size={18} />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-3">
            <label className="block text-xs font-bold text-gray-700">Nama Bank
              <input required value={form.bankName} onChange={(event) => setForm({ ...form, bankName: event.target.value })} className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#4a70a9]" placeholder="contoh: Bank Mandiri" />
            </label>
            <label className="block text-xs font-bold text-gray-700">Nomor Rekening
              <input required value={form.accountNumber} onChange={(event) => setForm({ ...form, accountNumber: event.target.value })} className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#4a70a9]" placeholder="contoh: 1390022345678" />
            </label>
            <label className="block text-xs font-bold text-gray-700">Atas Nama
              <input required value={form.accountName} onChange={(event) => setForm({ ...form, accountName: event.target.value })} className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#4a70a9]" placeholder="contoh: Nurman Course" />
            </label>
            <label className="block text-xs font-bold text-gray-700">Catatan
              <input value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#4a70a9]" placeholder="Opsional" />
            </label>
            <div className="flex flex-wrap gap-4 pt-1">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) => setForm({ ...form, isActive: event.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 accent-[#4a70a9]"
                />
                Aktif
              </label>
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                <input
                  type="checkbox"
                  checked={form.isDefault}
                  onChange={(event) => setForm({ ...form, isDefault: event.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 accent-[#4a70a9]"
                />
                Jadikan Default
              </label>
            </div>
            <div className="flex gap-2 pt-2">
              {editingAccount && <Button type="button" variant="ghost" onClick={resetForm} className="flex-1">Batal</Button>}
              <Button type="submit" disabled={saving} className="flex-1 justify-center inline-flex items-center gap-2"><Plus size={16} /> {saving ? "Menyimpan..." : editingAccount ? "Simpan Perubahan" : "Tambah"}</Button>
            </div>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
