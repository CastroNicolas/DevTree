import express from "express";
import router from "./router";
// const express = require("express"); CJS version => common js version
const app = express();

// Routing
app.use("/api", router);
export default app;
