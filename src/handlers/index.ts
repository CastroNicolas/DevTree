import { Request, Response } from "express";
import slugify from "slugify";
import { User } from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";

export const createAccount = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    const error = new Error("User whit this email already exists");
    res.status(409).json({ error: error.message });
    return;
  }

  const handle = slugify(req.body.handle, "");
  const handleExist = await User.findOne({ handle });

  if (handleExist) {
    const error = new Error("User whit this handle already exists");
    res.status(409).json({ error: error.message });
    return;
  }

  const user = new User(req.body);
  user.password = await hashPassword(password);
  user.handle = handle;
  await user.save();
  res.status(201).json("User created");
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // comprobar si el usuario existe
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("User whit this email doesn't exists");
    res.status(404).json({ error: error.message });
    return;
  }

  // comprobar si la contraseña es correcta

  const isPasswordCorrect = await checkPassword(password, user.password);
  if (!isPasswordCorrect) {
    const error = new Error("Password is incorrect");
    res.status(401).json({ error: error.message });
  } else {
    res.status(200).json(user);
  }
};
