'use strict';

const { Router } = require('express');

const bcryptjs = require('bcryptjs');
const User = require('./../models/user');
const Character = require('./../models/character');

const router = new Router();
const countries = require('./../views/datasets/countries');
const worldServers = require('./../views/datasets/worldservers');

const lookUpCharacter = require('./../lib/load-character');

router.get('/sign-up', (req, res, next) => {
  res.render('sign-up', { countries, worldServers });
});

router.post('/sign-up', (req, res, next) => {
  const { fullName, email, password, worldServer, nationality } = req.body;
  let inGameName = req.body.inGameName;
  let characterId;
  let user;
  let character;
  let isOwned = true;

  lookUpCharacter(inGameName, worldServer)
    .then((characterDocument) => {
      character = characterDocument;
      characterId = character.externalId;

      return bcryptjs.hash(password, 10);
    })
    .then((hash) => {
      return User.create({
        fullName,
        email,
        inGameName,
        worldServer,
        nationality,
        passwordHashAndSalt: hash,
        characterId: characterId,
        avatar: character.avatar
      });
    })
    .then((userDocument) => {
      user = userDocument;
      req.session.userId = user._id;
      return Character.findOne({ externalId: characterId })
        .populate('portrait')
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
      res.render('profile', { character, user, isOwned });
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

router.get('/sign-in', (req, res, next) => {
  res.render('sign-in');
});

router.post('/sign-in', (req, res, next) => {
  let user;
  const { email, password } = req.body;
  User.findOne({ email })
    .then((document) => {
      if (!document) {
        return Promise.reject(new Error("There's no user with that email."));
      } else {
        user = document;
        return bcryptjs.compare(password, user.passwordHashAndSalt);
      }
    })
    .then((result) => {
      if (result) {
        req.session.userId = user._id;
        res.redirect('/profile/' + user._id);
      } else {
        return Promise.reject(new Error('Wrong password.'));
      }
    })
    .catch((error) => {
      next(error);
    });
});

router.post('/sign-out', (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
