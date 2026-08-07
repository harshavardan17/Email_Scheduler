import express from "express";
import cors from "cors";

import emailRoutes from "./routes/email.routes";

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (_, res) => {

  res.json({

    success: true,

    message: "Email Scheduler API",

  });

});

app.use("/api/emails", emailRoutes);

export default app;