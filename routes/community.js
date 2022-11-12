'use strict';

const express = require('express');
const router = express.Router();
const routeGuard = require('./../middleware/route-guard');
const XIVAPI = require('@xivapi/js');
const xiv = new XIVAPI();
const Comment = require('./../models/comment');
const Data = require('../models/data');

// page where any user can make comments about anything

router.get('/', routeGuard, (req, res, next) => {
  Comment.find({ item: { $exists: true } })
    .populate('item')
    .populate('author')
    .then((comments) => {
      res.render('community', { comments });
    });
});

module.exports = router;
