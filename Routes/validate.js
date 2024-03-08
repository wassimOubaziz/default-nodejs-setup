const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const nodemailer = require("nodemailer");

//when he clickes the link in the email this route will be called
router.get("/:token", async (req, res) => {
  const token = req.params.token;
  try {
    const user = await User.findOne({ validationToken: token });
    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }
    user.active = true;
    user.validationToken = "";
    await user.save();
    res.status(200).redirect("http://localhost:5173/sign-in");
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});
module.exports = router;
