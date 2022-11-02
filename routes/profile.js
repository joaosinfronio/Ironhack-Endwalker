'use strict';

const express = require('express');
const router = express.Router();
const routeGuard = require('./../middleware/route-guard');
const XIVAPI = require('@xivapi/js');
const xiv = new XIVAPI();

router.get('/', routeGuard, (req, res, next) => {
  //TODO: xiv.character.get(gameId), see what columns are more important and pass the character to the profile
  res.render('profile');
});

//TODO: router.post('/edit,routeGuard', (req, res, next) => {});

//TODO: router.post('/edit,routeGuard', (req, res, next) => {});

module.exports = router;
