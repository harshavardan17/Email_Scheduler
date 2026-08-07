from pathlib import Path

files = {
    Path("src/pages/Compose.tsx"): '''import EmailForm from "../components/EmailForm";

function Compose() {
  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h1 className="text-2xl font-semibold text-white">Compose a new email</h1>
        <p className="mt-2 text-slate-400">Send a single message at the desired date and time.</p>
      </div>
      <EmailForm />
    </div>
  );
}

export default Compose;
''',
    Path("src/pages/Upload.tsx"): '''import UploadCSV from "../components/UploadCSV";

function Upload() {
  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h1 className="text-2xl font-semibold text-white">Upload CSV batch</h1>
        <p className="mt-2 text-slate-400">Schedule a large email campaign from a CSV file.</p>
      </div>
      <UploadCSV />
    </div>
  );
}

export default Upload;
''',
    Path("src/pages/Scheduled.tsx"): '''import ScheduledTable from "../components/ScheduledTable";

function Scheduled() {
  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h1 className="text-2xl font-semibold text-white">Scheduled campaigns</h1>
        <p className="mt-2 text-slate-400">Track pending and processing emails.</p>
      </div>
      <ScheduledTable />
    </div>
  );
}

export default Scheduled;
''',
    Path("src/pages/Sent.tsx"): '''import SentTable from "../components/SentTable";

function Sent() {
  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h1 className="text-2xl font-semibold text-white">Sent emails</h1>
        <p className="mt-2 text-slate-400">Review delivery history and search past messages.</p>
      </div>
      <SentTable />
    </div>
  );
}

export default Sent;
''',
    Path("src/components/DashboardCards.tsx"): '''import { RefreshCcw, Clock3, Mail, Send, AlertTriangle } from "lucide-react";

interface DashboardCardsProps {
  counts: {
    total: number;
    pending: number;
    sent: number;
    failed: number;
    scheduled: number;
  };
  onRefresh: () => void;
}

const cards = [
  { label: "Total Emails", key: "total", icon: Mail, color: "from-sky-500 to-indigo-500" },
  { label: "Pending", key: "pending", icon: Clock3, color: "from-amber-500 to-orange-500" },
  { label: "Sent", key: "sent", icon: Send, color: "from-emerald-500 to-sky-500" },
  { label: "Failed", key: "failed", icon: AlertTriangle, color: "from-rose-500 to-fuchsia-500" },
  { label: "Scheduled", key: "scheduled", icon: RefreshCcw, color: "from-slate-500 to-slate-700" },
];

function DashboardCards({ counts, onRefresh }: DashboardCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.key} className="glass-card overflow-hidden p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{card.label}</p>
                <p className="mt-4 text-4xl font-semibold text-white">{counts[card.key as keyof typeof counts]}</p>
              </div>
              <div className={`inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br ${card.color} text-white shadow-lg shadow-slate-950/40`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        );
      })}

      <button
        type="button"
        onClick={onRefresh}
        className="glass-card flex items-center justify-center gap-2 rounded-3xl border border-slate-700/90 bg-slate-900/80 px-6 py-5 text-sm font-semibold text-slate-200 transition hover:-translate-y-0.5 hover:bg-slate-900"
      >
        <RefreshCcw className="h-4 w-4" />
        Refresh dashboard
      </button>
    </div>
  );
}

export default DashboardCards;
''',
    Path("src/components/Navbar.tsx"): '''import { useEffect, useState } from "react";
import { RefreshCcw, Clock3 } from "lucide-react";

function Navbar() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setTime(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <header className="glass-panel sticky top-0 z-20 border-b border-white/10 bg-slate-950/95 px-4 py-4 shadow-sm shadow-black/10 backdrop-blur-xl lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-sky-400">SaaS dashboard</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Email Scheduler Studio</h2>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="inline-flex items-center gap-2 rounded-3xl bg-slate-900/80 px-4 py-3 text-sm text-slate-300 shadow-inner shadow-slate-950/50">
            <Clock3 className="h-4 w-4 text-sky-400" />
            <span>{time.toLocaleString()}</span>
          </div>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 rounded-3xl bg-slate-900/90 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
''',
    Path("src/components/EmailDetailsModal.tsx"): '''import { X } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { EmailJob } from "../services/emailService";

interface EmailDetailsModalProps {
  email: EmailJob;
  onClose: () => void;
}

function EmailDetailsModal({ email, onClose }: EmailDetailsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-2xl shadow-slate-950/50">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-sky-400">Email details</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Message preview</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-3xl bg-slate-900/90 p-3 text-slate-300 transition hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-800/90 bg-slate-900/80 p-5">
            <p className="text-sm text-slate-400">Recipient</p>
            <p className="mt-2 text-base font-semibold text-white">{email.recipient}</p>
          </div>
          <div className="rounded-3xl border border-slate-800/90 bg-slate-900/80 p-5">
            <p className="text-sm text-slate-400">Status</p>
            <div className="mt-2">
              <StatusBadge status={email.status} />
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          <div className="rounded-3xl border border-slate-800/90 bg-slate-900/80 p-5">
            <p className="text-sm text-slate-400">Subject</p>
            <p className="mt-2 text-base font-semibold text-white">{email.subject}</p>
          </div>

          <div className="rounded-3xl border border-slate-800/90 bg-slate-900/80 p-5">
            <p className="text-sm text-slate-400">Scheduled</p>
            <p className="mt-2 text-base text-slate-200">{new Date(email.scheduledTime).toLocaleString()}</p>
          </div>

          <div className="rounded-3xl border border-slate-800/90 bg-slate-900/80 p-5">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-slate-400">Sent time</p>
              <p className="text-sm text-slate-400">{email.sentAt ? new Date(email.sentAt).toLocaleString() : "Not sent yet"}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800/90 bg-slate-900/80 p-5">
            <p className="text-sm text-slate-400">Message body</p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-200">{email.body}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailDetailsModal;
''',
    Path("src/pages/Dashboard.tsx"): '''import { useEffect, useState } from "react";
import DashboardCards from "../components/DashboardCards";
import EmailForm from "../components/EmailForm";
import ScheduledTable from "../components/ScheduledTable";
import SentTable from "../components/SentTable";
import { getScheduledEmails, getSentEmails, EmailJob } from "../services/emailService";

function Dashboard() {
  const [scheduledEmails, setScheduledEmails] = useState<EmailJob[]>([]);
  const [sentEmails, setSentEmails] = useState<EmailJob[]>([]);

  const refresh = async () => {
    const [scheduled, sent] = await Promise.all([getScheduledEmails(), getSentEmails()]);
    setScheduledEmails(scheduled);
    setSentEmails(sent);
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Overview</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Email Scheduler Dashboard</h1>
            <p className="mt-2 max-w-2xl text-slate-400">Monitor queued emails, sent history, and launch new campaigns from one polished command center.</p>
          </div>
        </div>
      </div>

      <DashboardCards
        counts={{
          total: scheduledEmails.length + sentEmails.length,
          pending: scheduledEmails.filter((email) => email.status === "pending").length,
          sent: sentEmails.length,
          failed: scheduledEmails.filter((email) => email.status === "failed").length,
          scheduled: scheduledEmails.length,
        }}
        onRefresh={refresh}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="space-y-6">
          <EmailForm />
          <SentTable />
        </div>
        <div className="space-y-6">
          <ScheduledTable />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
''',
    Path("src/api/axios.ts"): '''import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

export default api;
''',
    Path("src/index.css"): '''@import "tailwindcss";

:root {
  color-scheme: dark;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-height: 100vh;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  background: radial-gradient(circle at top, rgba(56, 189, 248, 0.14), transparent 25%),
    linear-gradient(180deg, #020617 0%, #020617 100%);
  color: #e2e8f0;
}

button,
input,
textarea,
select {
  font: inherit;
}

img {
  display: block;
  max-width: 100%;
}

.glass-card {
  @apply bg-slate-950/80 border border-white/10 backdrop-blur-xl shadow-2xl;
}

.glass-panel {
  @apply bg-slate-950/90 border border-slate-700/60 backdrop-blur-xl shadow-xl;
}

.skeleton {
  @apply animate-pulse bg-slate-800 rounded-3xl;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
''',
}

for path, content in files.items():
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
print("Wrote files:")
for path in sorted(files):
    print(path, path.stat().st_size)
