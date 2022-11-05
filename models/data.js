'use strict';

const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema(
  {
    externalId: String,
    Icon: String,
    ItemSearchCategory: { Name: String },
    LevelEquip: Number,
    LevelItem: Number,
    Name: String,
    Rarity: Number,
    ItemKind: { Name: String },
    Description: String
  },
  { timestamp: true }
);

const Data = mongoose.model('Data', dataSchema);

module.exports = Data;
