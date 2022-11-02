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

router.get('/search', (req, res, next) => {
  let searchTerm = req.query.search;
  xiv
    .search(searchTerm, {
      indexes: 'item,achievement,instantcontent',
      columns: 'ID,Name,Icon,LevelItem,LevelEquip,ItemSearchCategory.Name'
      // filters: 'LevelItem>100'
    }) //TODO: recieve an object with indexes and filters
    .then((resultsDocument) => {
      const results = resultsDocument.Results;
      console.log(results);
      res.render('search', { results: results });
    });
});

module.exports = router;
