import api from "../api/axios";

export interface EmailJob {
  id: string;
  recipient: string;
  subject: string;
  body: string;
  status: string;
  scheduledTime: string;
  sentAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  hourlyLimit?: number;
  delayBetween?: number;
  bullJobId?: string;
  error?: string | null;
}

export interface BulkUploadResponse {
  success: boolean;
  scheduled: number;
  message: string;
}

export const getScheduledEmails = async (): Promise<EmailJob[]> => {
  const response = await api.get("/emails/scheduled");
  return response.data.data || [];
};

export const getSentEmails = async (): Promise<EmailJob[]> => {
  const response = await api.get("/emails/sent");
  return response.data.data || [];
};

export const scheduleEmail = async (payload: {
  recipient: string;
  subject: string;
  body: string;
  scheduledTime: string;
}): Promise<EmailJob> => {
  const response = await api.post("/emails/schedule", payload);
  return response.data.data;
};

export const uploadCsv = async (formData: FormData): Promise<BulkUploadResponse> => {
  const response = await api.post("/uploads", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const destroyAllEmails = async (): Promise<{ success: boolean; message?: string }> => {
  const response = await api.delete("/emails");
  return response.data;
};
