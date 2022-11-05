'use strict';

const express = require('express');
const router = express.Router();
const routeGuard = require('./../middleware/route-guard');
const XIVAPI = require('@xivapi/js');
const xiv = new XIVAPI();
const Comment = require('./../models/comment');

//Post a comment on an item recieves de item _id
router.post('/item/:id', routeGuard, (req, res, next) => {
  const { id } = req.params;
  const { message } = req.body;

  Comment.create({
    message,
    author: req.user._id,
    item: id
  })
    .then(() => {
      res.redirect('/item/' + id);
    })
    .catch((error) => next(error));
});

router.post('/profile/:id', routeGuard, (req, res, next) => {
  const { id } = req.params;
  const { message } = req.body;

  Comment.create({
    message,
    author: req.user._id,
    profile: id
  })
    .then(() => {
      res.redirect('/item/' + id);
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

  Comment.findOneAndDelete(id)
    .then(() => {
      res.redirect('/item/' + id);
    })
    .catch((error) => next(error));
});
module.exports = router;
