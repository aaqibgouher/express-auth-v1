const express = require("express");
const db = require("./database");
const router = require("./routes/authRoutes");
const app = express();
const PORT = 3000;
require("dotenv").config();

app.use(express.json());

// route mapping
app.use("/api", router);

app.listen(PORT, () => console.log(`Server running at ${PORT}`));
