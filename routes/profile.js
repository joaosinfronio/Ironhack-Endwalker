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
const SavedData = require('./../models/savedData');

const countries = require('./../views/datasets/countries');
const worldServers = require('./../views/datasets/worldservers');
const lookUpCharacter = require('./../lib/load-character');

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
  Character.findOne({ externalId: req.user.characterId })
    .then((character) => {
      res.render('profile-edit', {
        profile: req.user,
        character,
        countries,
        worldServers
      });
    })
    .catch((error) => next(error));
});

router.post('/edit', routeGuard, (req, res, next) => {
  const { fullName, worldServer, nationality } = req.body;
  let inGameName = req.body.inGameName;
  let characterId;
  let character, avatar, user;

  lookUpCharacter(inGameName, worldServer)
    .then((characterDocument) => {
      character = characterDocument;
      characterId = character.externalId;
      avatar = character.avatar;
    })
    .then(() => {
      return User.findByIdAndUpdate(
        req.user._id,
        {
          fullName,
          inGameName,
          worldServer,
          nationality,
          characterId: characterId,
          avatar: avatar
        },
        { new: true }
      );
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
      res.redirect('/profile/' + req.user._id);
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

router.post('/delete', routeGuard, (req, res, next) => {
  User.findByIdAndDelete(req.user._id)
    .then(() => {
      res.redirect(`/`);
    })
    .catch((error) => {
      next(error);
    });
});

//GET another users profile
router.get('/:id', routeGuard, (req, res, next) => {
  let user,
    character,
    isAbleToComment,
    isFollowing,
    isOwned,
    commentWithIsOwnedInfo;
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
    .then((comments) => {
      commentWithIsOwnedInfo = comments.map((comment) =>
        comment.getAddedInfo(req.user ? req.user._id : null)
      );
    })
    .then(() => {
      return SavedData.find({ user: req.user._id }).populate('item');
    })
    .then((savedData) => {
      res.render('profile', {
        character,
        commentWithIsOwnedInfo,
        userId,
        isAbleToComment,
        isFollowing,
        isOwned,
        savedData
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
