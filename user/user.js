import { Router } from "express";

export const userRouter = Router();

userRouter.post("/login", (req, res) => {
  res.send("login");
});

userRouter.post("/register", (req, res) => {
  res.send("register");
});
