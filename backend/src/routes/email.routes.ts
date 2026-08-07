import { Router } from "express";
import emailController from "../controllers/email.controller";

const router = Router();

router.post("/schedule", emailController.schedule);
router.post("/schedule-bulk", emailController.schedule);

router.get("/scheduled", emailController.scheduled);

router.get("/sent", emailController.sent);

router.delete("/", emailController.destroyAllEmails);

router.delete("/:id", emailController.deleteScheduledEmail);

router.get("/:id", emailController.getById);

export default router;