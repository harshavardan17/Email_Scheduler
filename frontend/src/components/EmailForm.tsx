import { useState } from "react";
import api from "../api/axios";
import { getLocalDatetimeInputValue, toISOStringFromLocalDatetimeInput } from "../utils/date";

function EmailForm() {
  const [form, setForm] = useState({
    recipient: "",
    subject: "",
    body: "",
    scheduledTime: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const scheduleEmail = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const payload = {
        ...form,
        // Preserve the user's selected local date/time and send it as an ISO timestamp.
        scheduledTime: toISOStringFromLocalDatetimeInput(form.scheduledTime) ?? form.scheduledTime,
      };

      const response = await api.post("/emails/schedule", payload);

      setMessage(`✅ Email scheduled successfully! ID: ${response.data.data.id}`);

      setForm({
        recipient: "",
        subject: "",
        body: "",
        scheduledTime: "",
      });
    } catch (error: any) {
      setMessage(
        `❌ ${error.response?.data?.message || "Unable to connect to backend."}`
      );
    }
  };

  return (
    <div className="rounded-xl bg-slate-800 p-6">
      <h2 className="mb-6 text-2xl font-semibold text-white">
        Compose Email
      </h2>

      <form className="space-y-4" onSubmit={scheduleEmail}>
        <input
          type="email"
          className="w-full rounded bg-slate-700 p-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Recipient Email"
          name="recipient"
          value={form.recipient}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          className="w-full rounded bg-slate-700 p-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Subject"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          required
        />

        <textarea
          rows={5}
          className="w-full rounded bg-slate-700 p-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Email Body"
          name="body"
          value={form.body}
          onChange={handleChange}
          required
        />

        <input
          type="datetime-local"
          className="w-full rounded bg-slate-700 p-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
          name="scheduledTime"
          value={form.scheduledTime}
          onChange={handleChange}
          min={getLocalDatetimeInputValue(new Date())}
          required
        />

        <button
          type="submit"
          className="w-full rounded bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-700"
        >
          Schedule Email
        </button>
      </form>

      {message && (
        <div className="mt-5 rounded bg-slate-700 p-3 text-sm text-white">
          {message}
        </div>
      )}
    </div>
  );
}

export default EmailForm;