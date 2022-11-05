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
  return xiv.character
    .get(externalId, { extended: true })
    .then((response) => {
      // console.log(response);
      characterResult = response.Character;
      // console.log(characterResult);
      const gearResult = characterResult.GearSet.Gear;
      // console.log(gearResult.Body);
      dataResults = Object.values(gearResult);
      dataResults = dataResults.map((result) => result.Item);
      // console.log(dataResults);
      const dataExternalIds = dataResults.map((result) => result.ID);
      // console.log(dataExternalIds);
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
      // console.log(missingDataResults);
      return Data.create(
        missingDataResults.map((result) => ({
          ...result,
          externalId: result.ID
        }))
      );
    })
    .then((newlyAddedDataDocuments) => {
      allData = [...existingData, ...newlyAddedDataDocuments];
      // console.log(allData);

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
              characterResult.GearSet.Gear.Body.Item
            )
          },
          Bracelets: {
            item: findDocumentIdForSlot(
              allData,
              characterResult.GearSet.Gear.Bracelets.Item
            )
          },
          Earrings: {
            item: findDocumentIdForSlot(
              allData,
              characterResult.GearSet.Gear.Earrings.Item
            )
          },
          Feet: {
            item: findDocumentIdForSlot(
              allData,
              characterResult.GearSet.Gear.Feet.Item
            )
          },
          Hands: {
            item: findDocumentIdForSlot(
              allData,
              characterResult.GearSet.Gear.Hands.Item
            )
          },
          Head: {
            item: findDocumentIdForSlot(
              allData,
              characterResult.GearSet.Gear.Head.Item
            )
          },
          Legs: {
            item: findDocumentIdForSlot(
              allData,
              characterResult.GearSet.Gear.Legs.Item
            )
          },
          MainHand: {
            item: findDocumentIdForSlot(
              allData,
              characterResult.GearSet.Gear.MainHand.Item
            )
          },
          Necklace: {
            item: findDocumentIdForSlot(
              allData,
              characterResult.GearSet.Gear.Necklace.Item
            )
          },
          Ring1: {
            item: findDocumentIdForSlot(
              allData,
              characterResult.GearSet.Gear.Ring1.Item
            )
          },
          Ring2: {
            item: findDocumentIdForSlot(
              allData,
              characterResult.GearSet.Gear.Ring2.Item
            )
          },
          SoulCrystal: {
            item: findDocumentIdForSlot(
              allData,
              characterResult.GearSet.Gear.SoulCrystal.Item
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
      // return Character.findOne({ externalId: characterDocument.externalId })
      //   .populate('gear.Body.item')
      //   .populate('gear.Earrings.item')
      //   .populate('gear.Bracelets.item');
      return characterDocument;
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

const loadCharacter = (externalId) => {
  return (
    Character.findOne({ externalId })
      // .populate('gear.Body.item')
      // .populate('gear.Earrings.item')
      // .populate('gear.Bracelets.item')
      .then((characterDocument) => {
        if (
          characterDocument &&
          Number(characterDocument.updatedAt) >
            Number(new Date()) - 24 * 60 * 60 * 1000
        ) {
          console.log('Character found in database.');
          return characterDocument;
        } else {
          return loadCharacterFromAPIAndCacheIt(externalId);
        }
      })
      .catch((err) => {
        console.log(err);
        throw err;
      })
  );
};

const lookUpCharacter = (name, server) => {
  return xiv.character.search(name, { server: server }).then((response) => {
    const results = response.Results;
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

module.exports = lookUpCharacter;
