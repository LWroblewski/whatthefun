const Event = require("../models/eventModel");
const Comment = require("../models/commentModel");
const errors = require("../errors/errors").errors;
const EventDTO = require("../dto/eventDTO");
const CommentDTO = require("../dto/commentDTO");
const mongoose = require("mongoose");


module.exports = function (app) {
  const userService = require("./userService")(app);
  const teamService = require("./teamService")(app);
  return {
    //  EVENTS

    getEvents: async function () {
      try {
        return Event.aggregate([
          {
            $match: {}
          },
          {
            $lookup: {
              from: 'users',
              localField: 'owner',
              foreignField: '_id',
              as: 'author'
            }
          },
          {
            $project: {
              "_id": 1,
              "event_type": 1,
              "title": 1,
              "long_desc": 1,
              "short_desc": 1,
              "target": 1,
              "target_type": 1,
              "comments": 1,
              "likes": 1,
              "status": 1,
              "created_date": 1,
              "author": {
                $let: {
                  vars: {
                    firstOwner: {
                      $arrayElemAt: ["$author", 0]
                    }
                  },
                  in: {
                    id: "$$firstOwner._id",
                    pseudo: "$$firstOwner.pseudo",
                    imageUrl: "$$firstOwner.imageUrl"
                  }
                }
              }
            }
          }
        ]).sort({ "created_date": -1 })
          .exec()
          .then(function (data) {
            return new Promise(function (resolve, reject) {
              const result = data.map(d => new EventDTO(d));
              resolve(result);
            });
          }, function (error) {
            new Promise(function (resolve, reject) {
              reject(error);
            });
          });
      } catch (e) {
        throw errors.default.DEFAULT;
      }
    },
    getMineEvents: async function (userId) {
      try {
        return Event.aggregate([
          {
            $match: {
              owner: new mongoose.Types.ObjectId(userId)
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'owner',
              foreignField: '_id',
              as: 'author'
            }
          },
          {
            $project: {
              "_id": 1,
              "event_type": 1,
              "title": 1,
              "long_desc": 1,
              "short_desc": 1,
              "target": 1,
              "target_type": 1,
              "comments": 1,
              "likes": 1,
              "status": 1,
              "created_date": 1,
              "author": {
                $let: {
                  vars: {
                    firstOwner: {
                      $arrayElemAt: ["$author", 0]
                    }
                  },
                  in: {
                    id: "$$firstOwner._id",
                    pseudo: "$$firstOwner.pseudo",
                    imageUrl: "$$firstOwner.imageUrl"
                  }
                }
              }
            }
          }
        ]).sort({ "created_date": -1 })
          .exec()
          .then(function (data) {
            return new Promise(function (resolve, reject) {
              const result = data.map(d => new EventDTO(d));
              resolve(result);
            });
          }, function (error) {
            new Promise(function (resolve, reject) {
              reject(error);
            });
          });
      } catch (e) {
        throw errors.default.DEFAULT;
      }
    },

    getTaggedEvents: async function (userId) {
      try {
        const allEvent = await this.getEvents();
        return new Promise(function (resolve, reject) {
          const result = allEvent.filter(e => e.members.some(m => m.id.toString() === userId.toString()));
          resolve(result);
        });
      } catch (e) {
        throw errors.default.DEFAULT;
      }
    },

    getEvent: async function (eventId) {
      try {
        const comments = await this.getCommentEvent(eventId);
        return Event.aggregate([
          {
            $match: {
              _id: new mongoose.Types.ObjectId(eventId)
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'owner',
              foreignField: '_id',
              as: 'author'
            }
          },
          {
            $project: {
              "_id": 1,
              "event_type": 1,
              "title": 1,
              "long_desc": 1,
              "short_desc": 1,
              "target": 1,
              "target_type": 1,
              "comments": 1,
              "likes": 1,
              "status": 1,
              "created_date": 1,
              "author": {
                $let: {
                  vars: {
                    firstOwner: {
                      $arrayElemAt: ["$author", 0]
                    }
                  },
                  in: {
                    id: "$$firstOwner._id",
                    pseudo: "$$firstOwner.pseudo",
                    imageUrl: "$$firstOwner.imageUrl"
                  }
                }
              }
            }
          }
        ]).exec()
          .then(function (data) {
            return new Promise(function (resolve, reject) {
              data[0].comments = comments;
              const result = new EventDTO(data[0]);
              resolve(result);
            });
          }, function (error) {
            new Promise(function (resolve, reject) {
              reject(error);
            });
          });
      } catch (e) {
        throw errors.default.NOT_FOUND;
      }
    },

    getUserEvents: async function (userId) {

    },

    deleteEvent: async function (eventId) {

    },

    createEvent: async function (event) {
      if (event && event.event_type && event.owner && event.title) {
        try {
          const user = await userService.getUser(event.owner);
          const newEvent = new Event(event);
          let result = await newEvent.save();
          if (user.team) {
            teamService.addPointsToTeam(user.team, app.get("eventReward"));
          }
          return this.getEvent(result._id);
        } catch (e) {
          throw e;
        }
      } else {
        throw errors.default.BAD_PARAMS;
      }
    },



    // COMMENTS

    commentComment: async function (comment) {
      if (comment && comment.content && comment.author && comment.target) {
        try {
          const user = await userService.getUser(comment.author);
          const com = await this.getComment(comment.target);
          const newComment = new Comment(comment);
          const result = await newComment.save();
          if (user.team) {
            teamService.addPointsToTeam(user.team, app.get("commentReward"));
          }
          let comments = com.comments;
          if (!comments.includes(newComment._id)) {
            comments.push(newComment._id);
          }
          const update = await Comment.update({
            _id: comment.target
          }, {
              comments: comments
            });

          return new CommentDTO(result);
        } catch (e) {
          throw e;
        }
      } else {
        throw errors.default.BAD_PARAMS;
      }
    },

    likeComment: async function (comment) {
      if (comment && comment.author && comment.target) {
        try {
          const user = await userService.getUser(comment.author);
          const com = await this.getComment(comment.target);
          if (user.team) {
            teamService.addPointsToTeam(user.team, app.get("likeReward"));
          }
          let likes = com.likes;
          if (!likes.some(l => l.toString() === comment.author.toString())) {
            likes.push(comment.author);
          }
          const update = await Comment.update({
            _id: comment.target
          }, {
              likes: likes
            });

          return this.getComment(comment.target);
        } catch (e) {
          throw e;
        }
      } else {
        throw errors.default.BAD_PARAMS;
      }
    },

    commentEvent: async function (comment) {
      if (comment && comment.content && comment.author && comment.target) {
        try {
          const user = await userService.getUser(comment.author);
          const event = await this.getEvent(comment.target);
          const newComment = new Comment(comment);
          const result = await newComment.save();
          if (user.team) {
            teamService.addPointsToTeam(user.team, app.get("commentReward"));
          }
          let comments = event.comments;
          if (!comments.includes(newComment._id)) {
            comments.push(newComment._id);
          }
          const update = await Event.update({
            _id: comment.target
          }, {
              comments: comments
            });
          const commentCreated = await this.getComment(result._id);
          return commentCreated;
        } catch (e) {
          throw e;
        }
      } else {
        throw errors.default.BAD_PARAMS;
      }
    },

    likeEvent: async function (event) {
      if (event && event.author && event.target) {
        try {
          const user = await userService.getUser(event.author);
          const ev = await this.getEvent(event.target);
          if (user.team) {
            teamService.addPointsToTeam(user.team, app.get("likeReward"));
          }
          let likes = ev.likes;
          if (!likes.some(l => l.toString() === event.author.toString())) {
            likes.push(event.author);
          }
          const update = await Event.update({
            _id: event.target
          }, {
              likes: likes
            });
          return this.getEvent(event.target);
        } catch (e) {
          throw e;
        }
      } else {
        throw errors.default.BAD_PARAMS;
      }
    },

    getComment: async function (commentId) {
      try {
        return Comment.aggregate([
          {
            $match: {
              _id: new mongoose.Types.ObjectId(commentId)
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'author',
              foreignField: '_id',
              as: 'author'
            }
          },
          {
            $project: {
              "_id": 1,
              "content": 1,
              "target": 1,
              "likes": 1,
              "written_date": 1,
              "author": {
                $let: {
                  vars: {
                    firstAuthor: {
                      $arrayElemAt: ["$author", 0]
                    }
                  },
                  in: {
                    id: "$$firstAuthor._id",
                    pseudo: "$$firstAuthor.pseudo",
                    imageUrl: "$$firstAuthor.imageUrl"
                  }
                }
              }
            }
          }
        ]).exec()
          .then(function (data) {
            return new Promise(function (resolve, reject) {
              const result = new CommentDTO(data[0]);
              resolve(result);
            });
          }, function (error) {
            new Promise(function (resolve, reject) {
              reject(error);
            });
          });
      } catch (e) {
        throw errors.default.NOT_FOUND;
      }
    },

    getCommentEvent: async function (eventId) {
      try {
        return Comment.aggregate([
          {
            $match: {
              target: new mongoose.Types.ObjectId(eventId)
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'author',
              foreignField: '_id',
              as: 'author'
            }
          },
          {
            $project: {
              "_id": 1,
              "content": 1,
              "target": 1,
              "likes": 1,
              "written_date": 1,
              "author": {
                $let: {
                  vars: {
                    firstAuthor: {
                      $arrayElemAt: ["$author", 0]
                    }
                  },
                  in: {
                    id: "$$firstAuthor._id",
                    pseudo: "$$firstAuthor.pseudo",
                    imageUrl: "$$firstAuthor.imageUrl"
                  }
                }
              }
            }
          }
        ]).exec()
          .then(function (data) {
            return new Promise(function (resolve, reject) {
              const result = data.map(d => new CommentDTO(d));
              resolve(result);
            });
          }, function (error) {
            new Promise(function (resolve, reject) {
              reject(error);
            });
          });
      } catch (e) {
        throw errors.default.NOT_FOUND;
      }
    }
  }

}
