'use strict';

const express = require('express');
const router = express.Router();
const routeGuard = require('../middleware/route-guard');
const XIVAPI = require('@xivapi/js');
const Data = require('../models/data');
const SavedData = require('../models/savedData');
const xiv = new XIVAPI();
const Comment = require('./../models/comment');

//Get the detailed information about the Item, Recieves a external id
router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  let data;

  Data.findById(id)
    .then((dataDocument) => {
      data = dataDocument;
      console.log(data);
      return Comment.find({ item: data._id });
    })
    .then((comment) => {
      res.render('itemdetails', { data, comment });
    })
    .catch((error) => next(error));
});

//Post save an item
//TODO: create a function to add field savedItem in the item so we can chang the button to save and unsave
router.post('/:id/save', (req, res, next) => {
  const { id } = req.params;
  SavedData.create({
    item: id,
    user: req.user._id
  })
    .then(() => {
      res.redirect('/item/' + id);
    })
    .catch((error) => next(error));
});

//Delete/Unsave an item
router.post('/:id/unsave', (req, res, next) => {
  const { id } = req.params;
  SavedData.findOneAndDelete({
    item: id,
    user: req.user._id
  })
    .then(() => {
      res.redirect('/item/' + id);
    })
    .catch((error) => next(error));
});

module.exports = router;
