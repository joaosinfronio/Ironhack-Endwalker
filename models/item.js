'use strict';

const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  externalID: String,
  icon: String,
  itemSearchCategory: { name: String },
  levelEquip: number,
  levelItem: number,
  name: String
});

const Data = mongoose.model('Data', dataSchema);

module.exports = Data;
