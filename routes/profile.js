'use strict';

const express = require('express');
const router = express.Router();
const routeGuard = require('./../middleware/route-guard');
const XIVAPI = require('@xivapi/js');
const xiv = new XIVAPI();
const User = require('./../models/user');
const Character = require('./../models/character');
const Follow = require('./../models/follow');

//GET User's profile
router.get('/', routeGuard, (req, res, next) => {
  let user;
  User.findById(req.user._id)
    .then((userDocument) => {
      user = userDocument;
      return Character.findOne({
        externalId: user.characterId
      })
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
      console.log('Character', character.Portrait);
      res.render('profile', { user, character });
    })
    .catch((error) => next(error));
});

//GET another users profile
router.get('/:id', routeGuard, (req, res, next) => {
  let user;
  const { id } = req.params;
  User.findById(id)
    .then((userDocument) => {
      user = userDocument;
      return Character.findOne({
        externalId: user.characterId
      })
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
      console.log('Character', character.gear);
      res.render('profile', { character });
    })
    .catch((error) => next(error));
});

//POST Follow another user
router.post('/:id/follow', routeGuard, (req, res, next) => {
  const { id } = req.params;
  Follow.create({
    follower: req.user._id,
    followee: id
  })
    .then(() => {
      res.redirect(`/profile/${id}`);
    })
    .catch((error) => {
      next(error);
    });
});

//DELETE Following another User
router.post('/:id/unfollow', routeGuard, (req, res, next) => {
  const { id } = req.params;
  Follow.findOneAndDelete({
    follower: req.user._id,
    followee: id
  })
    .then(() => {
      res.redirect(`/profile/${id}`);
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
