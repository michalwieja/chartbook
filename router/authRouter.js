import express from "express";
import User from "../models/UserModel.js";
import Joi from "joi";
import bcrypt from "bcrypt";

const router = express.Router();
// schema validataion
const schema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().min(3).required().email(),
  password: Joi.string().min(6).required(),
});

router.post("/register", async (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // chceck is user exists
  const user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("Email already taken");
  //hash
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    const savedUser = await newUser.save();
    res.send({ user: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/login", async (req, res) => {
  //validation
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // chceck is user exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("wrong email");
  //hash
  const validUser = await bcrypt.compare(req.body.password, user.password);
  if (!validUser) return res.status(400).send("wrong pass");

  res.send("logged in");
});

export default router;
