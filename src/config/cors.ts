import { CorsOptions } from "cors";

export const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (origin === "http://localhost:5173") {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  //   credentials: true,
  //   methods: ["GET", "POST", "PUT", "DELETE"],
  //   allowedHeaders: ["Content-Type", "Authorization"],
};
