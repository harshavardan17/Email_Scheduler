import UploadCSV from "../components/UploadCSV";

function Upload() {
  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h1 className="text-2xl font-semibold text-white">Upload CSV batch</h1>
        <p className="mt-2 text-slate-400">Schedule a large email campaign from a CSV file.</p>
      </div>
      <UploadCSV />
    </div>
  );
}

export default Upload;
