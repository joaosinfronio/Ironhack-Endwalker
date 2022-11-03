'use strict';

const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  externalId: String,
  Icon: String,
  ItemSearchCategory: { name: String },
  LevelEquip: Number,
  LevelItem: Number,
  Name: String,
  Rarity: Number
});

const Data = mongoose.model('Data', dataSchema);

module.exports = Data;
