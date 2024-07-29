const mongoose = require("mongoose");

const CarSchema = new mongoose.Schema({
  make: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    require: true,
  },
  year: {
    type: Number,
    require: true,
  },
  mileage: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// JS Backend Web Dev Tutorial 11:36:30 MongoDB collection named here - will give lowercase plural of name 
module.exports = mongoose.model("Car", CarSchema);
