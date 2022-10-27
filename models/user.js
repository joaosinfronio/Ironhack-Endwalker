'use strict';

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true
    },
    inGameName: {
      type: String
    },
    worldServer: {
      type: String
    },
    nationality: {
      type: String
    },
    profilePicture: {
      type: String
    },
    passwordHashandSalt: {
      type: String,
      required: true,
      minlength: 8
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
