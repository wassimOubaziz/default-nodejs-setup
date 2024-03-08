const router = require("express").Router();
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const User = require("../Models/User"); // Adjust the path based on your project structure

//////////////////////register///////////////////////////
router.post("/", async (req, res) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }
  console.log(email, username, password);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_SECRET,
      pass: process.env.PASSWORD_SECRET,
    },
  });

  const body = req.body;

  try {
    const user = await User.findOne({ email: body.email });
    let token;
    if (!user) {
      token = jwt.sign({ email: body.email }, process.env.JWT_SECRET);
      body.validationToken = token;
      await User.create(body);
      ///this will change in deployment
      const validationLink = `http://localhost:4000/api/validate/${token}`;
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_SECRET, // replace with your actual email address
          to: body.email, // replace with the new user's email address
          subject: "Please validate your account",
          text: `Click this link to validate your account: ${validationLink}`,
          html: `<div style="background-color: #f2f2f2; padding: 20px;">
              <h2>Thanks for registering!</h2>
              <p>Please click the button below to validate your account:</p>
              <a href="${validationLink}" style="background-color: #4CAF50; border: none; color: white; padding: 12px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin-top: 20px;">Validate Account</a>
          </div>
          `,
        });
      } catch (e) {
        if (e) await User.deleteOne({ email: body.email });
        return res.status(400).json({ message: e.message });
      }
    }

    res.status(200).json({
      message: "Validation Email succesfully sended plz check your email",
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

module.exports = router;
