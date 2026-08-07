import { useEffect, useState } from "react";
import api from "../api/axios";

interface ScheduledEmail {
  id: string;
  recipient: string;
  subject: string;
  status: string;
  scheduledTime: string;
}

interface ScheduledApiResponse {
  success: boolean;
  count: number;
  data: ScheduledEmail[];
}

function ScheduledTable() {
  const [emails, setEmails] = useState<ScheduledEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchScheduledEmails = async () => {
    try {
      const response = await api.get<ScheduledApiResponse>("/emails/scheduled");
      setEmails(response.data.data ?? []);
    } catch (error) {
      console.error("Failed to fetch scheduled emails", error);
      setEmails([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScheduledEmails();

    const intervalId = window.setInterval(() => {
      fetchScheduledEmails();
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, []);

  const formatScheduledTime = (value: string) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleString();
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);

    try {
      await api.delete(`/emails/${id}`);
      setEmails((prev) => prev.filter((email) => email.id !== id));
    } catch (error) {
      console.error("Failed to delete scheduled email", error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-6 shadow-lg shadow-slate-950/20">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Scheduled Emails</h2>
          <p className="text-sm text-slate-400">Automatically refreshes every 5 seconds.</p>
        </div>
        {!loading && (
          <span className="rounded-full bg-slate-700 px-3 py-1 text-sm text-slate-300">
            {emails.length} {emails.length === 1 ? "email" : "emails"}
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900/70 py-10 text-slate-300">
          <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-slate-400 border-t-sky-400" />
          Loading scheduled emails...
        </div>
      ) : emails.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-600 bg-slate-900/60 py-10 text-center text-slate-400">
          No scheduled emails
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-700">
          <table className="min-w-full divide-y divide-slate-700 text-left text-sm">
            <thead className="bg-slate-900/80 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-medium">Recipient</th>
                <th className="px-4 py-3 font-medium">Subject</th>
                <th className="px-4 py-3 font-medium">Scheduled Time</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700 bg-slate-800/70 text-slate-200">
              {emails.map((email) => (
                <tr key={email.id} className="transition hover:bg-slate-700/60">
                  <td className="px-4 py-3">{email.recipient}</td>
                  <td className="px-4 py-3">{email.subject}</td>
                  <td className="px-4 py-3">{formatScheduledTime(email.scheduledTime)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-amber-300">
                        {email.status}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDelete(email.id)}
                        disabled={deletingId === email.id}
                        className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1.5 text-xs font-medium text-rose-300 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletingId === email.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ScheduledTable;