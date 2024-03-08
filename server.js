require("dotenv").config();
const mongoose = require("mongoose");

const app = require("./app");
const URL = process.env.URL;

mongoose.set("strictQuery", true);
mongoose.connect(URL).then(() => {
  console.log("connected to mongo");
});

const PORT = process.env.PORT || "3600";

app.listen(PORT, "0.0.0.0", () => console.log("http://localhost:" + PORT));
