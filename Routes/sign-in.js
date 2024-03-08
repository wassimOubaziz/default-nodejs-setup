const router = require("express").Router();
const User = require("../Models/User");

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  if (!email || !password) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }
  try {
    const user = await User.findByCredentials(email, password);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (!user.active) {
      return res.status(400).json({ message: "Please validate your account" });
    }
    const token = await user.generateAuthToken();
    res.status(200).json({
      token,
      role: user.role,
      user: { email: user.email, role: user.role, username: user.username },
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

module.exports = router;
