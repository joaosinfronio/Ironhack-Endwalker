'use strict';

const express = require('express');
const router = express.Router();
const routeGuard = require('./../middleware/route-guard');
const XIVAPI = require('@xivapi/js');
const xiv = new XIVAPI();
const Comment = require('./../models/comment');
const Data = require('../models/data');

//Get Commnews for a specific item
router.get('/item/:id', (req, res, next) => {
  const { id } = req.params;
  Comment.find({ item: id }).then((comment) => {});
});

//Post a comment on an item recieves de item _id
router.post('/item/:id', routeGuard, (req, res, next) => {
  const { id } = req.params;
  const { message } = req.body;
  let comment;

  Comment.create({
    message,
    author: req.user._id,
    item: id
  })
    .then((commentDocument) => {
      comment = commentDocument;
      return Data.findByIdAndUpdate(
        id,
        { LastComment: comment._id },
        { new: true }
      );
    })
    .then((data) => {
      res.redirect('/item/' + id);
    })
    .catch((error) => next(error));
});

//GET comments
router.get('/profile/:id', (req, res, next) => {});

//Post a comment on an profile recieves de profile _id
router.post('/profile/:id', routeGuard, (req, res, next) => {
  const { id } = req.params;
  const { message } = req.body;

  return Comment.create({
    message,
    author: req.user._id,
    profile: id
  })
    .then(() => {
      res.redirect('/profile/' + id);
    })
    .catch((error) => next(error));
});

router.post('/:id/edit', routeGuard, (req, res, next) => {
  const { id } = req.params;
  const { message } = req.body;

  Comment.findByIdAndUpdate(id, {
    message
  })
    .then(() => {
      res.redirect('/profile/' + id);
    })
    .catch((error) => next(error));
});

//Deletes a comment on an item recieves de item _id and a message
//TODO: Only remove comments that belong  to user, by creating a field isOwned or throw an error
router.post('/:id/delete', routeGuard, (req, res, next) => {
  const { id } = req.params;

  Comment.findByIdAndDelete(id)
    .then((comment) => {
      if (comment.profile) {
        res.redirect('/profile/' + comment.profile);
      } else {
        res.redirect('/item/' + comment.item);
      }
    })
    .catch((error) => next(error));
});
module.exports = router;
