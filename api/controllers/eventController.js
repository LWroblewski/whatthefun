module.exports = function (app) {
  const errors = require("../errors/errors").errors;
  const service = require("../services/eventService")(app);
  const mongoose = require("mongoose");

  return {
    getEvents: async function (req, res) {
      try {
        const query = req.query;
        let events;
        const eventType = query.type;
        if (query.filter) {
          const filter = query.filter;
          if (filter === 'mine') {
            events = await service.getMineEvents(eventType, req.decodedUser.id);
          }
          else if (filter === 'tagged') {
            events = await service.getTaggedEvents(eventType, req.decodedUser.id);
          }
        } else {
          events = await service.getEvents(eventType);
        }
        res.json(events);
      } catch (e) {
        res.status(e.status).send(e.desc);
      }
    },

    createEvent: async function (req, res) {
      try {
        req.body.target = req.body.members;
        req.body.owner = new mongoose.Types.ObjectId(req.decodedUser.id);
        req.body.event_type = req.body.type;
        const newEvent = await service.createEvent(req.body);
        res.json(newEvent);
      } catch (e) {
        res.status(e.status).send(e.desc);
      }
    },
    getEvent: async function (req, res) {
      try {
        const event = await service.getEvent(req.params.eventId);
        res.json(event);
      } catch (e) {
        res.status(e.status).send(e.desc);
      }
    },
    getEventComments: async function (req, res) {
      console.log("comment event");
      console.log(req.body);
      console.log(req.params);
      res.send({});
    },
    commentEvent: async function (req, res) {
      try {
        req.body.target = new mongoose.Types.ObjectId(req.params.eventId);
        req.body.author = new mongoose.Types.ObjectId(req.decodedUser.id);
        const newComment = await service.commentEvent(req.body);
        res.json(newComment);
      } catch (e) {
        res.status(e.status).send(e.desc);
      }
    },
    likeEvent: async function (req, res) {
      try {
        req.body.target = new mongoose.Types.ObjectId(req.params.eventId);
        req.body.author = new mongoose.Types.ObjectId(req.decodedUser.id);
        const newEvent = await service.likeEvent(req.body);
        res.json(newEvent);
      } catch (e) {
        res.status(e.status).send(e.desc);
      }
    },
    commentComment: async function (req, res) {
      try {
        req.body.target = new mongoose.Types.ObjectId(req.params.commentId);
        req.body.author = new mongoose.Types.ObjectId(req.decodedUser.id);
        const newComment = await service.commentComment(req.body);
        res.json(newComment);
      } catch (e) {
        res.status(e.status).send(e.desc);
      }
    },
    likeComment: async function (req, res) {
      try {
        req.body.target = new mongoose.Types.ObjectId(req.params.commentId);
        req.body.author = new mongoose.Types.ObjectId(req.decodedUser.id);
        const newComment = await service.likeComment(req.body);
        res.json(newComment);
      } catch (e) {
        res.status(e.status).send(e.desc);
      }
    },
    getComment: async function (req, res) {
      try {
        const comment = await service.getComment(req.params.commentId);
        res.json(comment);
      } catch (e) {
        res.status(e.status).send(e.desc);
      }
    },
    getCommentComments: async function (req, res) {
      console.log("comment comments");
      console.log(req.body);
      console.log(req.params);
      res.send({});
    }
  }
}
