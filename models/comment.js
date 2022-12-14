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
    },
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

commentSchema.methods.getAddedInfo = function (userId) {
  const comment = this;
  if (comment.author !== null) {
    const isOwnComment = userId
      ? String(userId) === String(comment.author._id)
      : false;
    return {
      ...comment.toJSON(),
      isOwnComment
    };
  }
  return comment;
};

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
