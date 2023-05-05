import express from "express";
import { userRouter } from "./user/user.js";

const port = 8000;
const app = express();

app.use("/user", userRouter);

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
