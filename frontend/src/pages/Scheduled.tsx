import ScheduledTable from "../components/ScheduledTable";

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
