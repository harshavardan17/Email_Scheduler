import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Mail,
  Upload,
  Clock3,
  Send,
} from "lucide-react";

const navigation = [
  { label: "Home", href: "/", icon: LayoutDashboard },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Compose Email", href: "/compose", icon: Mail },
  { label: "Upload CSV", href: "/upload", icon: Upload },
  { label: "Scheduled", href: "/scheduled", icon: Clock3 },
  { label: "Sent", href: "/sent", icon: Send },
];

function Sidebar() {
  return (
    <aside className="hidden lg:flex lg:w-72 xl:w-80 flex-col gap-6 px-6 py-8 bg-slate-950/90 glass-panel ring-1 ring-white/10">
      <div>
        <p className="text-sky-400 uppercase tracking-[0.3em] text-xs font-semibold mb-4">
          Email Scheduler
        </p>
        <h1 className="text-2xl font-semibold text-white">Control Center</h1>
        <p className="mt-2 text-slate-400 text-sm">Manage scheduled and sent campaigns in one place.</p>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-slate-800 text-white shadow-xl shadow-sky-500/10"
                    : "text-slate-300 hover:bg-slate-900/80 hover:text-white"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
