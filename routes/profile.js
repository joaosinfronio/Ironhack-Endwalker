'use strict';

const express = require('express');
const router = express.Router();
const routeGuard = require('./../middleware/route-guard');
const XIVAPI = require('@xivapi/js');
const xiv = new XIVAPI();
const User = require('./../models/user');
const Character = require('./../models/character');
const Follow = require('./../models/follow');
const Comment = require('./../models/comment');

//GET User's profile
// router.get('/', routeGuard, (req, res, next) => {
//   let user;
//   let character;
//   let userId;
//   let isAbleToComment;
//   User.findById(req.user._id)
//     .then((userDocument) => {
//       user = userDocument;
//       userId = user._id;
//       isAbleToComment = true;
//       return Character.findOne({
//         externalId: user.characterId
//       })
//         .populate('portrait')
//         .populate('gear.Body.item')
//         .populate('gear.Earrings.item')
//         .populate('gear.Bracelets.item')
//         .populate('gear.Feet.item')
//         .populate('gear.Hands.item')
//         .populate('gear.Head.item')
//         .populate('gear.Legs.item')
//         .populate('gear.MainHand.item')
//         .populate('gear.Necklace.item')
//         .populate('gear.Ring1.item')
//         .populate('gear.Ring2.item')
//         .populate('gear.SoulCrystal.item');
//     })
//     .then((characterDocument) => {
//       character = characterDocument;
//       return Comment.find({ profile: user._id }).populate('author');
//     })
//     .then((comment) => {
//       res.render('profile', {
//         user,
//         character,
//         comment,
//         userId,
//         isAbleToComment
//       });
//     })
//     .catch((error) => next(error));
// });

router.get('/edit', routeGuard, (req, res, next) => {
  res.render('profile-edit', { profile: req.user });
});

router.post('/edit', routeGuard, (req, res, next) => {
  res.render('profile-edit', { profile: req.user });
});

//GET another users profile
router.get('/:id', (req, res, next) => {
  let user, character, isAbleToComment, isFollowing, isOwned;
  const { id } = req.params;
  const userId = id;
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
    .then((characterDocument) => {
      character = characterDocument;
      return Follow.findOne({ follower: req.user._id, followee: user._id });
    })
    .then((follow) => {
      isFollowing = follow ? true : false;
      return Follow.findOne({ follower: user._id, followee: req.user._id });
    })
    .then((follow) => {
      isAbleToComment = follow && isFollowing ? true : false;
      if (userId == req.user._id) {
        isAbleToComment = true;
        isOwned = true;
      }
      return Comment.find({ profile: user._id }).populate('author');
    })
    .then((comment) => {
      res.render('profile', {
        character,
        comment,
        userId,
        isAbleToComment,
        isFollowing,
        isOwned
      });
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
