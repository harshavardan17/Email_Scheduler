import { useEffect, useState } from "react";
import api from "../api/axios";
import { formatDateInIndia } from "../utils/date";

interface ScheduledEmail {
  id: string;
  recipient: string;
  subject: string;
  status: string;
  scheduledTime: string;
}

function ScheduledTable() {
  const [emails, setEmails] = useState<ScheduledEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchScheduledEmails = async () => {
    try {
      const response = await api.get("/emails/scheduled", {
        params: { search, page: 1, limit: 100 },
      });
      setEmails(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch scheduled emails:", error);
      setEmails([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScheduledEmails();

    const interval = setInterval(() => {
      fetchScheduledEmails();
    }, 5000);

    return () => clearInterval(interval);
  }, [search]);

  const formatScheduledTime = (value: string) => formatDateInIndia(value);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this scheduled email?")) return;

    setDeletingId(id);

    try {
      await api.delete(`/emails/${id}`);
      setEmails((prev) => prev.filter((email) => email.id !== id));
    } catch (error) {
      console.error("Failed to delete email:", error);
      alert("Unable to delete email.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = async (email: ScheduledEmail) => {
    const recipient = window.prompt("Update recipient email", email.recipient);
    if (recipient === null) return;

    const subject = window.prompt("Update subject", email.subject);
    if (subject === null) return;

    const scheduledTime = window.prompt("Update scheduled time (ISO or local format)", email.scheduledTime);
    if (scheduledTime === null) return;

    try {
      await api.patch(`/emails/${email.id}`, {
        recipient: recipient.trim(),
        subject: subject.trim(),
        scheduledTime,
      });
      fetchScheduledEmails();
    } catch (error) {
      console.error("Failed to update email:", error);
      alert("Unable to update email.");
    }
  };

  return (
    <div className="rounded-xl bg-slate-800 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">
            Scheduled Emails
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Automatically refreshes every 5 seconds.
          </p>
        </div>

        {!loading && (
          <span className="rounded-full bg-blue-600 px-3 py-1 text-sm text-white">
            {emails.length} {emails.length === 1 ? "Email" : "Emails"}
          </span>
        )}
      </div>

      <div className="mb-4">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search recipient or subject"
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10 text-slate-300">
          <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-slate-500 border-t-blue-500"></div>
          Loading scheduled emails...
        </div>
      ) : emails.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-600 py-12 text-center text-slate-400">
          No scheduled emails found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-900 text-slate-300">
              <tr>
                <th className="px-4 py-3">Recipient</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Scheduled Time</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-700 bg-slate-800">
              {emails.map((email) => (
                <tr
                  key={email.id}
                  className="transition hover:bg-slate-700/40"
                >
                  <td className="px-4 py-3">{email.recipient}</td>

                  <td className="px-4 py-3">{email.subject}</td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    {formatScheduledTime(email.scheduledTime)}
                  </td>

                  <td className="px-4 py-3">
                    <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-semibold uppercase text-yellow-300">
                      {email.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(email)}
                        className="rounded-lg bg-sky-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-sky-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(email.id)}
                        disabled={deletingId === email.id}
                        className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                      >
                        {deletingId === email.id
                          ? "Deleting..."
                          : "Delete"}
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