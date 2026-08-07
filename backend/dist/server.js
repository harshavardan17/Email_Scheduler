"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./config/db"));
require("./config/redis");
require("./queue/email.worker");
const upload_routes_1 = __importDefault(require("./routes/upload.routes"));
app_1.default.use("/api/uploads", upload_routes_1.default);
const PORT = Number(process.env.PORT) || 5000;
async function bootstrap() {
    try {
        await db_1.default.$connect();
        console.log("✅ PostgreSQL Connected");
        app_1.default.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
}
bootstrap();
