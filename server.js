//This is the server

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const file = require("path");
const fileUpload = require("express-fileupload");
const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

const app = express();

const data = require("./routes/api/data");
const auth = require("./routes/api/auth");

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());
app.use("/api/data", data);
app.use("/api/auth", auth);
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server ${PORT} is up and running`);
});
