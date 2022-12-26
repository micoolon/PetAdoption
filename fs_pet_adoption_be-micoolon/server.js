const express = require("express");
const cors = require("cors");
const app = express();
const port = 4000;
app.use(express.json());
app.use(cors());

app.use("/signup", require("./routes/signup"));
app.use("/login", require("./routes/login"));
app.use("/pet", require("./routes/pet"));
app.use("/user", require("./routes/user"));

app.listen(port, () => {
  console.log("server is running!");
});
