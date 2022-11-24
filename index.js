const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

// Middle Wares
app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Photo-Phactory server is running");
});

app.listen(port, () => {
  console.log(`Photo-Phactory server is running on port ${port}`);
});
