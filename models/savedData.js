'use strict';

const mongoose = require('mongoose');

const savedDataSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Data'
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

const SavedData = mongoose.model('savedData', savedDataSchema);

module.exports = SavedData;
