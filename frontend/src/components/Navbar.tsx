import { useEffect, useState } from "react";
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
