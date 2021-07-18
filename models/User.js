const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  images: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FormData",
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
