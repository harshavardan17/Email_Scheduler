import { Request, Response } from "express";
import { signToken } from "../utils/jwt";

class AuthController {
  async login(req: Request, res: Response) {
    const email = String(req.body?.email || "").trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: "A valid email is required" });
    }

    const token = signToken({ sub: email, email });

    return res.json({
      success: true,
      token,
      user: { email },
    });
  }

  async me(req: Request, res: Response) {
    return res.json({
      success: true,
      user: {
        email: (req as any).user?.email || "guest@example.com",
      },
    });
  }
}

export default new AuthController();
