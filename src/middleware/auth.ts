import { Request, Response, NextFunction } from "express";
import { IUser, User } from "../models/User";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const user = await User.findById(req.params.id);
  const bearer = req.headers.authorization;
  if (!bearer) {
    const error = new Error("Not authenticated");
    res.status(401).json({ error: error.message });
    return;
  }

  const [, token] = bearer.split(" ");
  if (!token) {
    const error = new Error("Not authenticated");
    res.status(401).json({ error: error.message });
    return;
  }

  try {
    const result = jwt.verify(token, process.env.JWT_SECRET);
    if (typeof result === "object" && result.payload.id) {
      const user = await User.findById(result.payload.id).select("-password");
      if (!user) {
        const error = new Error("User not found");
        res.status(404).json({ error: error.message });
      }
      req.user = user;
      next();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
