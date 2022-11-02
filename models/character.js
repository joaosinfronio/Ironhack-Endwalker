'use strict';

const mongoose = require('mongoose');

// Possibly use nested schema
const gearSlot = {
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Data'
  }
  // modifiers: [{}]
};

const characterSchema = new mongoose.Schema(
  {
    externalId: String,
    name: String,
    server: String,
    gear: {
      Body: gearSlot,
      Bracelets: gearSlot,
      Earrings: gearSlot
    }
  },
  { timestamps: true }
);

const Character = mongoose.model('Character', characterSchema);

module.exports = Character;
