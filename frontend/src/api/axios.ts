import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://email-scheduler-8rr9.onrender.com/api",
});

export default api;