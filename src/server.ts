import express from "express";
import router from "./router";
import cors from "cors";
import { corsOptions } from "./config/cors";
import "dotenv/config";
import { connectDB } from "./config/db";

// const express = require("express"); CJS version => common js version
const app = express();
connectDB();

app.use(cors(corsOptions));
// Leer datos de formulario
app.use(express.json());

// Routing
app.use("/", router);
export default app;
