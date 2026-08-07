import { RefreshCcw, Clock3, Mail, Send, AlertTriangle } from "lucide-react";

interface DashboardCardsProps {
  counts: {
    total: number;
    pending: number;
    sent: number;
    failed: number;
    scheduled: number;
  };
  onRefresh: () => void;
  onDestroy: () => void;
}

const cards = [
  { label: "Total Emails", key: "total", icon: Mail, color: "from-sky-500 to-indigo-500" },
  { label: "Pending", key: "pending", icon: Clock3, color: "from-amber-500 to-orange-500" },
  { label: "Sent", key: "sent", icon: Send, color: "from-emerald-500 to-sky-500" },
  { label: "Failed", key: "failed", icon: AlertTriangle, color: "from-rose-500 to-fuchsia-500" },
  { label: "Scheduled", key: "scheduled", icon: RefreshCcw, color: "from-slate-500 to-slate-700" },
];

function DashboardCards({ counts, onRefresh, onDestroy }: DashboardCardsProps) {
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

      <button
        type="button"
        onClick={onDestroy}
        className="glass-card flex items-center justify-center gap-2 rounded-3xl border border-red-500/80 bg-red-600/10 px-6 py-5 text-sm font-semibold text-red-300 transition hover:-translate-y-0.5 hover:bg-red-600/20"
      >
        <AlertTriangle className="h-4 w-4 text-red-300" />
        Destroy data
      </button>
    </div>
  );
}

export default DashboardCards;
