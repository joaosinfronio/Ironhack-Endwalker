'use strict';

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Data'
    }
  },
  {
    timestamps: true
  }
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
