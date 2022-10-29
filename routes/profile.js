'use strict';

const express = require('express');
const router = express.Router();
const routeGuard = require('./../middleware/route-guard');
const XIVAPI = require('@xivapi/js');
const xiv = new XIVAPI();

router.get('/', routeGuard, (req, res, next) => {
  res.render('profile');
});

module.exports = router;
