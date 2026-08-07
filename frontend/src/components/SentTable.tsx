import { useEffect, useState } from "react";
import api from "../api/axios";

interface SentEmail {
  id: string;
  recipient: string;
  subject: string;
  status: string;
  sentAt: string;
}

interface SentApiResponse {
  success: boolean;
  count: number;
  data: SentEmail[];
}

function SentTable() {
  const [emails, setEmails] = useState<SentEmail[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSentEmails = async () => {
    try {
      const response = await api.get<SentApiResponse>("/emails/sent");
      setEmails(response.data.data ?? []);
    } catch (error) {
      console.error("Failed to fetch sent emails", error);
      setEmails([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSentEmails();

    const intervalId = window.setInterval(() => {
      fetchSentEmails();
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, []);

  const formatSentTime = (value: string) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleString();
  };

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-6 shadow-lg shadow-slate-950/20">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Sent Emails</h2>
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
          <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-slate-400 border-t-emerald-400" />
          Loading sent emails...
        </div>
      ) : emails.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-600 bg-slate-900/60 py-10 text-center text-slate-400">
          No sent emails
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-700">
          <table className="min-w-full divide-y divide-slate-700 text-left text-sm">
            <thead className="bg-slate-900/80 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-medium">Recipient</th>
                <th className="px-4 py-3 font-medium">Subject</th>
                <th className="px-4 py-3 font-medium">Sent Time</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700 bg-slate-800/70 text-slate-200">
              {emails.map((email) => (
                <tr key={email.id} className="transition hover:bg-slate-700/60">
                  <td className="px-4 py-3">{email.recipient}</td>
                  <td className="px-4 py-3">{email.subject}</td>
                  <td className="px-4 py-3">{formatSentTime(email.sentAt)}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-emerald-300">
                      {email.status}
                    </span>
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

export default SentTable;