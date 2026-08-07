"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const email_controller_1 = __importDefault(require("../controllers/email.controller"));
const router = (0, express_1.Router)();
router.post("/schedule", email_controller_1.default.schedule);
router.post("/schedule-bulk", email_controller_1.default.schedule);
router.get("/scheduled", email_controller_1.default.scheduled);
router.get("/sent", email_controller_1.default.sent);
router.delete("/:id", email_controller_1.default.deleteScheduledEmail);
router.get("/:id", email_controller_1.default.getById);
exports.default = router;
