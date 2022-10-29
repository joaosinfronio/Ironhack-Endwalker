'use strict';

const express = require('express');
const router = express.Router();
const routeGuard = require('./../middleware/route-guard');
const XIVAPI = require('@xivapi/js');
const xiv = new XIVAPI();

router.get('/', (req, res, next) => {
  res.render('home', { title: 'Hello World!' });
});

router.get('/private', routeGuard, (req, res, next) => {
  res.render('private');
});

router.get('/search', (req, res, next) => {
  let searchTerm = req.query.search;
  xiv.search(searchTerm).then((resultsDocument) => {
    const results = resultsDocument.Results;
    console.log(results);
    res.render('search', { results: results });
  });
});

module.exports = router;
