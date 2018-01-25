const Event = require("../models/eventModel");
const Comment = require("../models/commentModel");
const errors = require("../errors/errors").errors;
const EventDTO = require("../dto/eventDTO");
const CommentDTO = require("../dto/commentDTO");


module.exports = function(app) {
  const userService = require("./userService")(app);
  const teamService = require("./teamService")(app);
  return {


    //  EVENTS


    getEvents: async function() {
      try {
        const events = await Event.find({});
        const eventsDto = [];
        for (let i = 0; i < events.length; i++) {
          eventsDto.push(new EventDTO(events[i]));
        }
        return eventsDto;
      } catch (e) {
        throw errors.default.DEFAULT;
      }
    },

    getEvent: async function(eventId) {
      try {
        const event = await Event.findById(eventId);
        return new EventDTO(event);
      } catch (e) {
        throw errors.default.NOT_FOUND;
      }
    },

    getUserEvents: async function(userId) {

    },

    deleteEvent: async function(eventId) {

    },

    createEvent: async function(event) {
      if (event && event.event_type && event.owner && event.title) {
        try {
          const user = await userService.getUser(event.owner);
          const newEvent = new Event(event);
          const result = await newEvent.save();
          if (user.team) {
            teamService.addPointsToTeam(user.team, 3);
          }
          return new EventDTO(result);
        } catch (e) {
          throw e;
        }
      } else {
        throw errors.default.BAD_PARAMS;
      }
    },



    // COMMENTS

    commentComment: async function(comment) {
      if (comment && comment.content && comment.author && comment.target) {
        try {
          const user = await userService.getUser(comment.author);
          const com = await this.getComment(comment.target);
          const newComment = new Comment(comment);
          const result = await newComment.save();
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

    commentEvent: async function(comment) {
      if (comment && comment.content && comment.author && comment.target) {
        try {
          const user = await userService.getUser(comment.author);
          const event = await this.getEvent(comment.target);
          const newComment = new Comment(comment);
          console.log(newComment);
          const result = await newComment.save();
          console.log(result);
          let comments = event.comments;
          if (!comments.includes(newComment._id)) {
            comments.push(newComment._id);
          }
          const update = await Event.update({
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

    getComment: async function(commentId) {
      try {
        const comment = await Comment.findById(commentId);
        return new CommentDTO(comment);
      } catch (e) {
        throw errors.default.NOT_FOUND;
      }
    }
  }

}
