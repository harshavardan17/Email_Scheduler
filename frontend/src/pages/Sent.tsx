import SentTable from "../components/SentTable";

function Sent() {
  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h1 className="text-2xl font-semibold text-white">Sent emails</h1>
        <p className="mt-2 text-slate-400">Review delivery history and search past messages.</p>
      </div>
      <SentTable />
    </div>
  );
}

export default Sent;
