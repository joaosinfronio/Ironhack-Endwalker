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
    portrait: String,
    server: String,
    gear: {
      Body: gearSlot,
      Bracelets: gearSlot,
      Earrings: gearSlot,
      Feet: gearSlot,
      Hands: gearSlot,
      Head: gearSlot,
      Legs: gearSlot,
      MainHand: gearSlot,
      Necklace: gearSlot,
      Ring1: gearSlot,
      Ring2: gearSlot,
      SoulCrystal: gearSlot
    },
    avatar: String
  },
  { timestamps: true }
);

const Character = mongoose.model('Character', characterSchema);

module.exports = Character;
