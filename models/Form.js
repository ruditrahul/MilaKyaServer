const mongoose = require("mongoose");

const formSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  placeName: {
    required: true,
    type: String,
  },
  description: {
    type: String,
  },
  img: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Form = mongoose.model("FormData", formSchema);

module.exports = Form;
