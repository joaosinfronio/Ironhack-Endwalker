'use strict';

const express = require('express');
const router = express.Router();
const routeGuard = require('../middleware/route-guard');
const XIVAPI = require('@xivapi/js');
const xiv = new XIVAPI();

router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  xiv
    .search('', {
      indexes: 'item',
      columns: 'ID,Name,Icon,LevelItem,LevelEquip,ItemSearchCategory.Name',
      filters: `ID=${id}`
    })
    .then((item) => {
      console.log(item);
      item = item.Results[0];
      res.render('itemdetails', { item });
    });
});

module.exports = router;
