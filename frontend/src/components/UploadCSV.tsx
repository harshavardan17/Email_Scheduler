import { useState } from "react";
import type { ChangeEvent, DragEvent, FormEvent } from "react";
import api from "../api/axios";

interface UploadResponse {
  success: boolean;
  count: number;
  emails: string[];
}

function UploadCSV() {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewEmails, setPreviewEmails] = useState<string[]>([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [startTime, setStartTime] = useState("");
  const [delayBetweenEmails, setDelayBetweenEmails] = useState("2");
  const [hourlyLimit, setHourlyLimit] = useState("100");
  const [scheduling, setScheduling] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const resetForm = () => {
    setFile(null);
    setPreviewEmails([]);
    setSubject("");
    setBody("");
    setStartTime("");
    setDelayBetweenEmails("2");
    setHourlyLimit("100");
    setUploadProgress(0);
  };

  const getErrorMessage = (error: unknown) => {
    if (typeof error === "string") {
      return error;
    }

    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: { data?: { message?: string; error?: string } };
      };

      return axiosError.response?.data?.message || axiosError.response?.data?.error || "Something went wrong.";
    }

    return "Something went wrong.";
  };

  const handleFileSelection = (selectedFile: File | null) => {
    if (!selectedFile) {
      return;
    }

    if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
      setErrorMessage("Please choose a .csv file.");
      return;
    }

    setFile(selectedFile);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFileSelection(event.target.files?.[0] ?? null);
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragActive(false);
    handleFileSelection(event.dataTransfer.files?.[0] ?? null);
  };

  const uploadCsv = async () => {
    if (!file) {
      setErrorMessage("Please choose a CSV file before uploading.");
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setErrorMessage("");
    setSuccessMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post<UploadResponse>("/uploads", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
          }
        },
      });

      setPreviewEmails(response.data.emails ?? []);
      setSuccessMessage(`Loaded ${response.data.count ?? response.data.emails.length} recipient(s) from the CSV.`);
    } catch (error) {
      setPreviewEmails([]);
      setErrorMessage(getErrorMessage(error));
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const scheduleEmails = async (event: FormEvent) => {
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement;
    const subjectInput = form.querySelector<HTMLInputElement>('#subject');
    const bodyInput = form.querySelector<HTMLTextAreaElement>('#body');
    const startTimeInput = form.querySelector<HTMLInputElement>('#startTime');
    const delayInput = form.querySelector<HTMLInputElement>('#delayBetweenEmails');
    const hourlyLimitInput = form.querySelector<HTMLInputElement>('#hourlyLimit');

    const nextSubject = subjectInput?.value?.trim() ?? subject.trim();
    const nextBody = bodyInput?.value?.trim() ?? body.trim();
    const nextStartTime = startTimeInput?.value ?? startTime;
    const nextDelayBetweenEmails = Number(delayInput?.value ?? delayBetweenEmails);
    const nextHourlyLimit = Number(hourlyLimitInput?.value ?? hourlyLimit);

    setSubject(nextSubject);
    setBody(nextBody);
    setStartTime(nextStartTime);
    setDelayBetweenEmails(String(nextDelayBetweenEmails));
    setHourlyLimit(String(nextHourlyLimit));

    if (!previewEmails.length) {
      setErrorMessage("Upload and preview recipients before scheduling.");
      return;
    }

    if (!nextSubject || !nextBody || !nextStartTime) {
      setErrorMessage("Please fill in subject, body, and start time.");
      return;
    }

    setScheduling(true);
    setErrorMessage("");
    setSuccessMessage("");

    const requestBody = {
      recipients: previewEmails,
      subject: nextSubject,
      body: nextBody,
      startTime: nextStartTime,
      delayBetweenEmails: Number(nextDelayBetweenEmails),
      hourlyLimit: Number(nextHourlyLimit),
    };

    console.log("Scheduling payload:", requestBody);

    try {
      const response = await api.post("/emails/schedule-bulk", requestBody);
      const scheduledCount = response.data?.count ?? previewEmails.length;
      const failedCount = previewEmails.length - scheduledCount;

      setSuccessMessage(
        `Scheduled ${scheduledCount} email(s) successfully.` +
          (failedCount > 0 ? ` ${failedCount} failed to schedule.` : "")
      );
      resetForm();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setScheduling(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-6 shadow-lg shadow-slate-950/20">
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Upload & Schedule Emails</h2>
          <p className="text-sm text-slate-400">Upload a CSV, preview recipients, and queue a bulk campaign.</p>
        </div>
        <div className="rounded-full border border-slate-600 bg-slate-700/70 px-3 py-1 text-sm text-slate-300">
          {previewEmails.length} recipient(s) ready
        </div>
      </div>

      {successMessage ? (
        <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {successMessage}
        </div>
      ) : null}

      {errorMessage ? (
        <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {errorMessage}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <label
            htmlFor="csv-upload"
            className={`flex cursor-pointer flex-col rounded-2xl border p-8 text-center transition ${dragActive ? "border-sky-400 bg-sky-500/10" : "border-dashed border-slate-600 bg-slate-900/60"}`}
            onDragOver={(event) => {
              event.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
          >
            <input id="csv-upload" type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-sky-500/15 text-sky-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 16a4 4 0 01-.88-7.9A5.5 5.5 0 0117.5 6a5.5 5.5 0 01.5 10.9H17" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 12v6m0 0l-3-3m3 3l3-3" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-white">Drag & drop your CSV here</p>
            <p className="mt-2 text-sm text-slate-400">or click to browse for a .csv file</p>
            <p className="mt-4 text-sm text-slate-500">{file ? `Selected file: ${file.name}` : "Supported format: CSV"}</p>
            {uploading ? (
              <div className="mt-4 w-full">
                <div className="mb-2 h-2 rounded-full bg-slate-700">
                  <div className="h-2 rounded-full bg-sky-400 transition-all" style={{ width: `${uploadProgress}%` }} />
                </div>
                <p className="text-sm text-slate-400">Uploading... {uploadProgress}%</p>
              </div>
            ) : null}
          </label>

          <button
            type="button"
            onClick={uploadCsv}
            disabled={uploading || !file}
            className="w-full rounded-xl bg-sky-500 px-4 py-3 font-medium text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
          >
            {uploading ? "Uploading..." : "Upload CSV"}
          </button>

          <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-medium text-white">Recipient Preview</h3>
              <span className="text-sm text-slate-400">{previewEmails.length} found</span>
            </div>

            {previewEmails.length ? (
              <ul className="max-h-48 space-y-2 overflow-auto text-sm text-slate-300">
                {previewEmails.map((email) => (
                  <li key={email} className="rounded-lg bg-slate-800/80 px-3 py-2">
                    {email}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-400">Upload a CSV to preview the email addresses returned by the backend.</p>
            )}
          </div>
        </div>

        <form onSubmit={scheduleEmails} className="space-y-4 rounded-2xl border border-slate-700 bg-slate-900/40 p-5">
          <div>
            <label htmlFor="subject" className="mb-2 block text-sm font-medium text-slate-300">
              Subject
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              className="w-full rounded-xl border border-slate-600 bg-slate-800 px-3 py-2.5 text-sm text-white outline-none ring-0 transition focus:border-sky-400"
              placeholder="Campaign subject"
            />
          </div>

          <div>
            <label htmlFor="body" className="mb-2 block text-sm font-medium text-slate-300">
              Body
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              rows={4}
              className="w-full rounded-xl border border-slate-600 bg-slate-800 px-3 py-2.5 text-sm text-white outline-none transition focus:border-sky-400"
              placeholder="Message body"
            />
          </div>

          <div>
            <label htmlFor="startTime" className="mb-2 block text-sm font-medium text-slate-300">
              Start Time
            </label>
            <input
              id="startTime"
              type="datetime-local"
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
              className="w-full rounded-xl border border-slate-600 bg-slate-800 px-3 py-2.5 text-sm text-white outline-none transition focus:border-sky-400"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="delayBetweenEmails" className="mb-2 block text-sm font-medium text-slate-300">
                Delay Between Emails
              </label>
              <input
                id="delayBetweenEmails"
                type="number"
                min="0"
                value={delayBetweenEmails}
                onChange={(event) => setDelayBetweenEmails(event.target.value)}
                className="w-full rounded-xl border border-slate-600 bg-slate-800 px-3 py-2.5 text-sm text-white outline-none transition focus:border-sky-400"
              />
            </div>

            <div>
              <label htmlFor="hourlyLimit" className="mb-2 block text-sm font-medium text-slate-300">
                Hourly Limit
              </label>
              <input
                id="hourlyLimit"
                type="number"
                min="1"
                value={hourlyLimit}
                onChange={(event) => setHourlyLimit(event.target.value)}
                className="w-full rounded-xl border border-slate-600 bg-slate-800 px-3 py-2.5 text-sm text-white outline-none transition focus:border-sky-400"
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800/70 px-4 py-3">
            <div>
              <p className="text-sm text-slate-400">Ready to schedule</p>
              <p className="text-lg font-semibold text-white">{previewEmails.length} recipient(s)</p>
            </div>
            <button
              type="submit"
              disabled={scheduling || !previewEmails.length}
              className="rounded-xl bg-emerald-500 px-4 py-2.5 font-medium text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
            >
              {scheduling ? "Scheduling..." : "Schedule Emails"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UploadCSV;