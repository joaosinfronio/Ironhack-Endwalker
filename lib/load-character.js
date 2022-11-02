const Data = require('./../models/data');
const XIVAPI = require('@xivapi/js');
const Character = require('../models/character');
const xiv = new XIVAPI();

const findDocumentIdForSlot = (documents, itemResult) => {
  const matchingDocument = documents.find((item) => {
    return Number(item.externalId) === itemResult.ID;
  });
  if (matchingDocument) {
    return matchingDocument._id;
  } else {
    return undefined;
  }
};

const loadCharacterFromAPIAndCacheIt = (externalId) => {
  let characterResult;
  let dataResults;
  let existingData;
  let allData;
  xiv.character
    .get(externalId)
    .then((response) => {
      characterResult = response.Character;
      const gearResult = characterResult.GearSet.Gear;
      dataResults = Object.values(gearResult);
      const dataExternalIds = dataResults.map((result) => result.ID);
      return Data.find({ externalId: dataExternalIds });
    })
    .then((existingsDataDocuments) => {
      existingData = existingsDataDocuments;
      const missingDataResults = dataResults.filter((dataResult) => {
        const exists = existingsDataDocuments.some(
          (existingDocument) => existingDocument.externalId === dataResult.ID
        );
        return !exists;
      });
      return Data.create(
        missingDataResults.map((result) => ({
          ...result,
          externalId: result.ID
        }))
      );
    })
    .then((newlyAddedDataDocuments) => {
      allData = [...existingData, ...newlyAddedDataDocuments];

      return Character.findOne({ externalId: externalId });
    })
    .then((existingCharacterDocument) => {
      const characterData = {
        name: characterResult.Name,
        server: characterResult.Server,
        externalId: characterResult.ID,
        gear: {
          Body: {
            item: findDocumentIdForSlot(
              allData,
              characterResult.GearSet.Gear.Body
            )
          },
          Bracelets: {
            item: findDocumentIdForSlot(
              allData,
              characterResult.GearSet.Gear.Bracelets
            )
          },
          Earrings: {
            item: findDocumentIdForSlot(
              allData,
              characterResult.GearSet.Gear.Earrings
            )
          }
        }
      };

      if (existingCharacterDocument) {
        return Character.findOneAndUpdate({ externalId }, characterData);
      } else {
        return Character.create(characterData);
      }
    })
    .then((characterDocument) => {
      return characterDocument;
    });
};

const loadCharacter = async (externalId) => {
  await Character.findOne({ externalId: externalId }).then(
    (characterDocument) => {
      if (
        characterDocument &&
        Number(characterDocument.updatedAt) >
          Number(new Date()) - 24 * 60 * 60 * 1000
      ) {
        console.log('Character found in database.');
        return characterDocument;
      } else {
        console.log('Loading character from API');
        return loadCharacterFromAPIAndCacheIt(externalId);
      }
    }
  );
};

const lookUpCharacter = async (name, server) => {
  await xiv.character.search(name, { server: server }).then((response) => {
    const results = response.Results;
    console.log(results);
    if (results.length === 0) {
      throw new Error('Character not found.');
    }
    if (results.length > 1) {
      throw new Error('Incomplete character name.');
    }
    const externalId = results[0].ID;
    return loadCharacter(externalId);
  });
};

exports.loadCharacter = loadCharacter;
exports.lookUpCharacter = lookUpCharacter;
