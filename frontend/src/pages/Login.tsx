import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("demo@mailer.local");

  const handleGoogleLogin = async () => {
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { email: email.trim() || "demo@mailer.local" });
      const token = response.data?.token;

      if (!token) {
        throw new Error("No token returned by backend");
      }

      localStorage.setItem("email_scheduler_token", token);
      toast.success("Signed in successfully");
      navigate("/dashboard", { replace: true });
    } catch (error: any) {
      console.error("Login failed", error);
      toast.error(error?.response?.data?.message || "Login failed. Please check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(14,165,233,0.2),transparent_30%),radial-gradient(circle_at_85%_80%,rgba(16,185,129,0.12),transparent_28%)]" />
      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80 shadow-2xl shadow-black/40 backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden border-r border-white/10 p-12 lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="mb-10 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.28em] text-sky-300">
              <Mail className="h-5 w-5" />
              Email Scheduler
            </div>
            <p className="max-w-md text-sm font-medium uppercase tracking-[0.28em] text-slate-500">Campaign control, simplified</p>
            <h1 className="mt-5 max-w-xl text-5xl font-semibold leading-[1.05] text-white">
              Move every message with intention.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-slate-400">
              Schedule individual sends, queue CSV campaigns, and keep a clear view of what is moving through your pipeline.
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <ShieldCheck className="h-5 w-5 text-emerald-300" />
            Your workspace access stays protected.
          </div>
        </section>

        <section className="p-7 sm:p-10 lg:p-12">
          <div className="mb-12 flex items-center justify-between lg:hidden">
            <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.22em] text-sky-300">
              <Mail className="h-5 w-5" />
              Email Scheduler
            </div>
            <LockKeyhole className="h-5 w-5 text-slate-500" />
          </div>

          <div className="max-w-sm">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-sky-400">Welcome back</p>
            <h2 className="mt-4 text-3xl font-semibold text-white">Sign in to your workspace</h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Use your account to continue into the scheduler dashboard.
            </p>

            <div className="mt-6 space-y-3">
              <label className="block text-xs uppercase tracking-[0.2em] text-slate-400">Email</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-sky-500"
                placeholder="name@example.com"
              />
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-5 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 text-sm font-bold text-[#4285F4]">G</span>
              {loading ? "Connecting..." : "Continue with Google"}
              {!loading ? <ArrowRight className="ml-auto h-4 w-4" /> : null}
            </button>

            <div className="mt-8 flex items-start gap-3 border-t border-white/10 pt-6 text-xs leading-5 text-slate-500">
              <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
              <p>Use the demo email below or replace it with your own validated address.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Login;
