"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailQueueScheduler = exports.emailQueue = void 0;
const BullMQ = __importStar(require("bullmq"));
const redis_1 = __importDefault(require("../config/redis"));
exports.emailQueue = new BullMQ.Queue("email-queue", {
    connection: redis_1.default,
    defaultJobOptions: {
        attempts: 3,
        removeOnComplete: 100,
        removeOnFail: 100,
        backoff: {
            type: "exponential",
            delay: 5000,
        },
    },
});
const SchedulerClass = BullMQ.JobScheduler ?? BullMQ.QueueScheduler;
if (!SchedulerClass) {
    throw new Error("No BullMQ scheduler class available. Please install a BullMQ version that exports JobScheduler or QueueScheduler.");
}
exports.emailQueueScheduler = new SchedulerClass("email-queue", {
    connection: redis_1.default,
});
exports.emailQueue.on("error", (error) => {
    console.error("❌ Email Queue error:", error);
});
exports.emailQueueScheduler.on("error", (error) => {
    console.error("❌ Email QueueScheduler error:", error);
});
exports.emailQueue.on("waiting", (jobId) => {
    console.log("⏳ Job waiting:", jobId);
});
exports.emailQueue.on("active", (job) => {
    console.log("▶️ Job active:", job.id, job.name);
});
