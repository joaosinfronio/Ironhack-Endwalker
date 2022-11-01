'use strict';

const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  externalId: String,
  icon: String,
  itemSearchCategory: { name: String },
  levelEquip: Number,
  levelItem: Number,
  name: String
});

const Data = mongoose.model('Data', dataSchema);

module.exports = Data;
