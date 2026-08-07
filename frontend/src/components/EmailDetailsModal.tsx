import { X } from "lucide-react";
import StatusBadge from "./StatusBadge";
import type { EmailJob } from "../services/emailService";

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
