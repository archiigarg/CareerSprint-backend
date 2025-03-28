import express from "express";
import connectDb from "../config/db.js";
import routerUser from "../routes/user.js";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

app.use("/user", routerUser);

const port = process.env.PORT || 5500;

app.get("/", (req, res) => {
  res.send("Hello World");
});

connectDb().then(() => {
  console.log("Database connected successfully");
});

if (process.env.NODE_ENV !== "vercel") {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

export default app; 