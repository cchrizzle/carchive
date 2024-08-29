const mongoose = require('mongoose');

const RefuelSchema = new mongoose.Schema({
  date: {
    type: Date,
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
    type: Number,   // 8/20/24: setting this to required gives errors:
    required: true,
        // Post validation failed: costPerGallon: Path `costPerGallon` is required.
        // ValidatorError: Path `costPerGallon` is required.
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  carId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// JS Backend Web Dev Tutorial 11:36:30 MongoDB collection named here - will give lowercase plural of name
module.exports = mongoose.model('Refuel', RefuelSchema);
