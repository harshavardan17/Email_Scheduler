import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import DashboardCards from "../components/DashboardCards";
import EmailForm from "../components/EmailForm";
import ScheduledTable from "../components/ScheduledTable";
// import SentTable from "../components/SentTable";
import {
  getScheduledEmails,
  getSentEmails,
  destroyAllEmails,
} from "../services/emailService";
import type { EmailJob } from "../services/emailService";

function Dashboard() {
  const [scheduledEmails, setScheduledEmails] = useState<EmailJob[]>([]);
  const [sentEmails, setSentEmails] = useState<EmailJob[]>([]);

  const refresh = async () => {
    const [scheduled, sent] = await Promise.all([getScheduledEmails(), getSentEmails()]);
    setScheduledEmails(scheduled);
    setSentEmails(sent);
  };

  const handleDestroyAllData = async () => {
    const confirmed = window.confirm(
      "This will permanently destroy all scheduled and sent email data. Continue?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await destroyAllEmails();
      toast.success("All email data has been destroyed.");
      refresh();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unable to destroy email data.";
      toast.error(message);
    }
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
        onDestroy={handleDestroyAllData}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="space-y-6">
          <EmailForm />
          {/* <SentTable /> */}
        </div>
        <div className="space-y-6">
          <ScheduledTable />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
