'use strict';

const express = require('express');
const router = express.Router();
const routeGuard = require('./../middleware/route-guard');
const XIVAPI = require('@xivapi/js');
const xiv = new XIVAPI();
const User = require('./../models/user');
const Character = require('./../models/character');

//TODO: xiv.character.get(gameId), see what columns are more important and pass the character to the profile
router.get('/', routeGuard, (req, res, next) => {
  let user, character;
  User.findById(req.user._id)
    .then((userDocument) => {
      user = userDocument;
      return Character.findOne({
        externalId: user.characterId
      })
        .populate('gear.Body.item')
        .populate('gear.Earrings.item')
        .populate('gear.Bracelets.item')
        .populate('gear.Feet.item')
        .populate('gear.Hands.item')
        .populate('gear.Head.item')
        .populate('gear.Legs.item')
        .populate('gear.MainHand.item')
        .populate('gear.Necklace.item')
        .populate('gear.Ring1.item')
        .populate('gear.Ring2.item')
        .populate('gear.SoulCrystal.item');
    })
    .then((character) => {
      console.log('Character', character.gear);
      res.render('profile', { user, character });
    })
    .catch((error) => next(error));
});

//TODO: router.post('/edit,routeGuard', (req, res, next) => {});

//TODO: router.post('/edit,routeGuard', (req, res, next) => {});

module.exports = router;
