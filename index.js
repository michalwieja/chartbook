import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import authRouter from "./router/authRouter.js";
import verify from "./router/verifyToken.js";

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => res.send("get ok"));
app.use("/auth", authRouter);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => app.listen(PORT, () => console.log(`server at ${PORT}`)))
  .catch((err) => console.log(err));
