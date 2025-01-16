import express from "express";
import cors from "cors";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN }));

app.use(
  express.json({
    limit: "16kb",
  })
);
// app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

import userRouter from "./routes/user.routes.js";
app.use("/api/v1/users/", userRouter);

app.use(function (err, req, res, next) {
  console.log("ERROR: ", err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send({ error: err.message });
});

export { app };
