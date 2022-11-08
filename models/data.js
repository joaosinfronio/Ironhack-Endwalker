'use strict';

const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema(
  {
    externalId: String,
    IconHD: String,
    ItemSearchCategory: { Name: String },
    LevelEquip: Number,
    LevelItem: Number,
    Name: String,
    Rarity: Number,
    ItemKind: { Name: String },
    Description: String,
    LastComment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }
  },
  { timestamp: true }
);

const Data = mongoose.model('Data', dataSchema);

module.exports = Data;
