import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import prisma from "./config/db";
import "./config/redis";
import "./queue/email.worker";
import uploadRoutes from "./routes/upload.routes";
import { requireAuth } from "./middleware/auth.middleware";

app.use("/api/uploads", requireAuth, uploadRoutes);

const PORT = Number(process.env.PORT) || 5000;

async function bootstrap() {
  try {
    await prisma.$connect();
    console.log("✅ PostgreSQL Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

bootstrap();