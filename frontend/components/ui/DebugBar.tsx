"use client";

import { useEffect, useState } from "react";
import { fetchLogs, addLogListener, FetchLogEntry } from "@/lib/api";
import { Terminal, Trash2, ChevronDown, Activity, Copy, Check } from "lucide-react";

export default function DebugBar() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<FetchLogEntry[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (process.env.NODE_ENV === "development") {
      setLogs([...fetchLogs]);
      const unsubscribe = addLogListener(() => {
        setLogs([...fetchLogs]);
      });
      return unsubscribe;
    }
  }, []);

  if (!mounted || process.env.NODE_ENV !== "development") {
    return null;
  }

  const handleClear = () => {
    fetchLogs.length = 0;
    setLogs([]);
    setCopied(false);
  };

  const handleCopyLogs = async () => {
    const text = logs
      .map(
        (log) =>
          `[${log.timestamp}] ${log.method} ${log.path} - Status: ${
            log.status > 0 ? log.status : "NET_ERR"
          }, Cache: ${log.cacheStatus}, Duration: ${log.duration}ms`
      )
      .join("\n");
    try {
      await navigator.clipboard.writeText(text || "No API requests logged yet.");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API gagal (mis. non-secure context) — fallback tanpa crash
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] font-mono text-[11px] select-text">
      {/* Tab Trigger (Collapsed) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 bg-gray-900/90 hover:bg-gray-900 text-white border border-gray-700/50 shadow-2xl rounded-full px-4 py-2 flex items-center gap-2 backdrop-blur-md cursor-pointer transition-all active:scale-95 z-[9999]"
        >
          <Terminal size={14} className="text-emerald-400 animate-pulse" />
          <span>NC Debugger ({logs.length})</span>
        </button>
      )}

      {/* Expanded Console Panel */}
      {isOpen && (
        <div className="bg-gray-900/95 border-t border-gray-800 text-gray-300 shadow-2xl h-64 flex flex-col backdrop-blur-lg">
          {/* Header */}
          <div className="bg-gray-950 border-b border-gray-850 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 font-bold text-white">
                <Terminal size={13} className="text-emerald-400" />
                <span>Nurman Course Debugger</span>
              </span>
              <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded-md">
                {logs.length} Requests
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLogs}
                className={`p-1 rounded hover:bg-gray-800 cursor-pointer flex items-center gap-1 transition-colors ${
                  copied ? "text-emerald-400" : "hover:text-sky-400"
                }`}
                title="Copy semua log ke clipboard"
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied && <span className="text-[10px] font-bold">Copied!</span>}
              </button>
              <button
                onClick={handleClear}
                className="hover:text-red-400 p-1 rounded hover:bg-gray-800 cursor-pointer"
                title="Clear Logs"
              >
                <Trash2 size={13} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:text-white p-1 rounded hover:bg-gray-800 cursor-pointer"
                title="Minimize"
              >
                <ChevronDown size={14} />
              </button>
            </div>
          </div>

          {/* Log List */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-800/50">
            {logs.length === 0 ? (
              <div className="p-8 text-center text-gray-500 flex flex-col items-center justify-center gap-2">
                <Activity size={24} className="text-gray-600 animate-pulse" />
                <span>Belum ada aktivitas request API. Silakan berpindah halaman atau lakukan transaksi.</span>
              </div>
            ) : (
              [...logs].reverse().map((log) => (
                <div key={log.id} className="px-4 py-2 hover:bg-gray-800/40 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      log.method === "GET" ? "bg-sky-500/10 text-sky-400 border border-sky-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}>
                      {log.method}
                    </span>
                    <span className="text-gray-400 truncate text-[11px]">{log.path}</span>
                  </div>
                  <div className="flex items-center gap-4 shrink-0 text-[10px]">
                    {/* Cache Status */}
                    <span className={`px-1.5 py-0.5 rounded font-bold text-[9px] ${
                      log.cacheStatus === "HIT" 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : log.cacheStatus === "MISS"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    }`}>
                      {log.cacheStatus}
                    </span>
                    {/* Status Code */}
                    <span className={`font-bold ${
                      log.status >= 400 
                        ? "text-red-400" 
                        : log.status >= 300 
                          ? "text-amber-400" 
                          : log.status > 0 
                            ? "text-emerald-400" 
                            : "text-gray-500"
                    }`}>
                      {log.status > 0 ? log.status : "NET_ERR"}
                    </span>
                    {/* Duration */}
                    <span className={`font-semibold ${log.duration > 200 ? "text-amber-400" : "text-gray-400"}`}>
                      {log.duration}ms
                    </span>
                    {/* Timestamp */}
                    <span className="text-gray-500">{log.timestamp}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}