const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
  carMake: {
    type: String,
    required: true,    // 8/22/24: Wasn't working before I disabled this, not sure why
  },
  carModel: {
    type: String,
    require: true,
  },
  carYear: {
    type: Number,
    require: true,
  },
  initialOdometer: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  refuels: [{ type: mongoose.Schema.Types.ObjectId,
    ref: 'Refuel' }],  // "one to many" relationship
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// JS Backend Web Dev Tutorial 11:36:30 MongoDB collection named here - will give lowercase plural of name
module.exports = mongoose.model('Car', CarSchema);
