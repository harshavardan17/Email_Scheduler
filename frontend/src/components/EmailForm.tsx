import { useState } from "react";
import api from "../api/axios";

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
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const scheduleEmail = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await api.post("/emails/schedule", form);
      setMessage(`✅ Email scheduled: ${response.data.data.id}`);
      setForm({
        recipient: "",
        subject: "",
        body: "",
        scheduledTime: "",
      });
    } catch (error: any) {
      setMessage(
        error.response?.data?.message || "Unable to connect to backend."
      );
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 space-y-4">
      <h2 className="text-2xl font-bold">Compose Email</h2>

      <form className="space-y-4" onSubmit={scheduleEmail}>
        <input
          className="w-full rounded bg-slate-700 p-3"
          placeholder="Recipient"
          name="recipient"
          value={form.recipient}
          onChange={handleChange}
        />

        <input
          className="w-full rounded bg-slate-700 p-3"
          placeholder="Subject"
          name="subject"
          value={form.subject}
          onChange={handleChange}
        />

        <textarea
          className="w-full rounded bg-slate-700 p-3"
          rows={5}
          placeholder="Email Body"
          name="body"
          value={form.body}
          onChange={handleChange}
        />

        <input
          type="datetime-local"
          className="w-full rounded bg-slate-700 p-3"
          name="scheduledTime"
          value={form.scheduledTime}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded font-semibold"
        >
          Schedule Email
        </button>
      </form>

      {message && <p className="text-sm text-slate-300">{message}</p>}
    </div>
  );
}

export default EmailForm;