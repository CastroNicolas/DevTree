import { Request, Response } from "express";
import slugify from "slugify";
import formidable from "formidable";
import { v4 as uuid } from "uuid";
import { User } from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import { generateJWT } from "../utils/jwt";
import cloudinary from "../config/cloudinary";

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
  }
  const token = generateJWT({ id: user._id });
  res.send(token);
};

export const getUser = async (req: Request, res: Response) => {
  res.json(req.user);
};

export const updatePrifile = async (req: Request, res: Response) => {
  try {
    const { description, links } = req.body;
    const handle = slugify(req.body.handle, "");
    const handleExist = await User.findOne({ handle });

    if (handleExist && handleExist.email !== req.user.email) {
      const error = new Error("User whit this handle already exists");
      res.status(409).json({ error: error.message });
      return;
    }
    // Actualiza el usuario
    req.user.handle = handle;
    req.user.description = description;
    req.user.links = links;
    await req.user.save();
    res.send("Profile updated");
  } catch (e) {
    const error = new Error("Something went wrong");
    res.status(500).json({ error: error.message });
  }
};
export const uploadImage = async (req: Request, res: Response) => {
  const form = formidable({ multiples: false });

  try {
    form.parse(req, (err, fields, files) => {
      cloudinary.uploader.upload(
        files.file[0].filepath,
        // { public_id: uuid() }, sirve para darle un id a la imagen
        { public_id: uuid() },
        async function (error, result) {
          if (error) {
            const error = new Error("Something went wrong uploading image");
            res.status(500).json({ error: error.message });
          }
          if (result) {
            req.user.image = result.secure_url;
            await req.user.save();
            res.json({ image: result.secure_url });
          }
        }
      );
    });
  } catch (e) {
    const error = new Error("Something went wrong");
    res.status(500).json({ error: error.message });
  }
};

export const getUserByHandler = async (req: Request, res: Response) => {
  try {
    const { handle } = req.params;
    const user = await User.findOne({ handle }).select(
      "-password -email -_id -__v"
    );
    if (!user) {
      const error = new Error("User whit this handle doesn't exists");
      res.status(404).json({ error: error.message });
      return;
    }
    res.json(user);
  } catch (e) {
    const error = new Error("Something went wrong");
    res.status(500).json({ error: error.message });
  }
};

export const searchByHandle = async (req: Request, res: Response) => {
  try {
    const { handle } = req.body;
    const user = await User.findOne({ handle });
    if (user) {
      const error = new Error(`${handle} already registered`);
      res.status(409).json({ error: error.message });
      return;
    }
    res.send(`${handle} is available`);
  } catch (e) {
    const error = new Error("Something went wrong");
    res.status(500).json({ error: error.message });
  }
};
