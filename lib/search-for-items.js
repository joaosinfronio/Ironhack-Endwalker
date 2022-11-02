const Data = require('./../models/data');
const XIVAPI = require('@xivapi/js');
const xiv = new XIVAPI();

const searchForItems = async (term, minLevelItem) => {
  let results;
  let existingData;
  await xiv
    .search(term, {
      indexes: 'item,achievement,instantcontent',
      columns:
        'ID,Name,Icon,LevelItem,LevelEquip,ItemSearchCategory.Name,Rarity',
      filters: `LevelItem>${minLevelItem}`
    })
    .then((response) => {
      results = response.Results;
      const resultExternalIds = results.map((result) => result.ID);
      return Data.find({ externalId: resultExternalIds });
    })
    .then((existingDataDocuments) => {
      existingData = existingDataDocuments;
      const resultsWhichDidNotExistInDatabase = results.filter((result) => {
        const exists = existingDataDocuments.some(
          (dataDocument) => dataDocument.externalId === result.ID
        );
        return !exists;
      });
      return Data.create(
        resultsWhichDidNotExistInDatabase.map((result) => ({
          ...result,
          externalId: result.ID
        }))
      );
    })
    .then((newlyAddedDataDocuments) => {
      const allDataDocuments = [...existingData, ...newlyAddedDataDocuments];
      return allDataDocuments;
    });
};

module.exports = searchForItems;
