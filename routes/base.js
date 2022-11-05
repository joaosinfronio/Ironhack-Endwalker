'use strict';

const express = require('express');
const router = express.Router();
const routeGuard = require('./../middleware/route-guard');
const XIVAPI = require('@xivapi/js');
const xiv = new XIVAPI();
const searchForItems = require('./../lib/search-for-items');
const Data = require('../models/data');

router.get('/', (req, res, next) => {
  res.render('home', {
    title: 'Welcome to the No. 1 FFXIV community in IronHack!'
  });
});

router.get('/search', (req, res, next) => {
  let searchTerm = req.query.search;
  searchForItems(searchTerm, 0)
    .then((dataResultDocuments) => {
      res.render('search', { results: dataResultDocuments, searchTerm });
    })
    .catch((error) => next(error));
});

module.exports = router;
