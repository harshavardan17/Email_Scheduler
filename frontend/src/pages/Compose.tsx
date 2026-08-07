import EmailForm from "../components/EmailForm";

function Compose() {
  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h1 className="text-2xl font-semibold text-white">Compose a new email</h1>
        <p className="mt-2 text-slate-400">Send a single message at the desired date and time.</p>
      </div>
      <EmailForm />
    </div>
  );
}

export default Compose;
