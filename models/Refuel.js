const mongoose = require('mongoose');

const RefuelSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  image: {
    type: String,
    require: true,
  },
  cloudinaryId: {
    type: String,
    require: true,
  },
  odometer: {
    type: Number,
    required: true,
  },
  gallons: {
    type: Number,
    required: true,
  },
  costPerGallon: {
    type: Number,
    required: true,
  },
  totalCost: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  carId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',   // Used for populate method
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// JS Backend Web Dev Tutorial 11:36:30 MongoDB collection named here - will give lowercase plural of name
module.exports = mongoose.model('Refuel', RefuelSchema);
