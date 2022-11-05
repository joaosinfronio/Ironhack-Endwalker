const Data = require('./../models/data');
const XIVAPI = require('@xivapi/js');
const xiv = new XIVAPI();

const searchForItems = (term, minLevelItem) => {
  let results;
  let existingData;
  return xiv
    .search(term, {
      indexes: 'item',
      columns:
        'ID,Name,IconHD,LevelItem,LevelEquip,ItemSearchCategory.Name,Rarity,ItemKind.Name,Description',
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
          (dataDocument) =>
            Number(dataDocument.externalId) === Number(result.ID)
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
      // console.log(newlyAddedDataDocuments);
      const allDataDocuments = [...existingData, ...newlyAddedDataDocuments];
      return allDataDocuments;
    });
};

module.exports = searchForItems;
