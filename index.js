const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoute = require("./routes/auth");
const loginRoute = require("./routes/login");
const userRoute = require("./routes/users");
const movieRoute = require("./routes/movies");
const listRoute = require("./routes/lists");
dotenv.config();
mongoose
  .connect(process.env.MONGO_DB_URI, { autoIndex: true })
  .then((res) => console.log("success connection with DB"))
  .catch((err) => console.log(err));
app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoute);

app.use("/api/login", loginRoute);
app.use("/api/users", userRoute);
app.use("/api/movies", movieRoute);

app.use("/api/lists", listRoute);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Backend is running"));
