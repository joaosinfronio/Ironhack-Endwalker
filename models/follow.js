'use strict';

const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
  follower: String,
  followee: String
});

const Follow = mongoose.model('Follow', followSchema);

module.exports = Follow;
