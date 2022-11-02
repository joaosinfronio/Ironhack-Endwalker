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
      return Character.findOne({ externalId: user.characterId });
    })
    .then((character) => {
      console.log(user, '', character);
      res.render('profile', { user, character });
    })
    .catch((error) => next(error));
});

//TODO: router.post('/edit,routeGuard', (req, res, next) => {});

//TODO: router.post('/edit,routeGuard', (req, res, next) => {});

module.exports = router;
