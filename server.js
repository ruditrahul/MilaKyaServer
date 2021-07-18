require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

const app = express();

const data = require("./routes/api/data");
const auth = require("./routes/api/auth");

app.use(bodyParser.urlencoded({ extended: false }));
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

app.listen(PORT, () => {
  console.log(`Server ${PORT} is up and running`);
});
