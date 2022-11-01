'use strict';

const express = require('express');
const router = express.Router();
const routeGuard = require('./../middleware/route-guard');
const XIVAPI = require('@xivapi/js');
const xiv = new XIVAPI();

router.get('/', (req, res, next) => {
  res.render('home', {
    title: 'Welcome to the No. 1 FFXIV community in IronHack!'
  });
});

router.get('/private', routeGuard, (req, res, next) => {
  res.render('private');
});

router.get('/search', (req, res, next) => {
  let searchTerm = req.query.search;
  searchForItems(searchTerm, 0).then((dataResultDocuments) => {
    res.render('search', { results: dataResultDocuments });
  });
});

module.exports = router;
