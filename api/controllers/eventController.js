module.exports = function(app) {
  const errors = require("../errors/errors").errors;
  const service = require("../services/eventService")(app);

  return {
    getEvents: async function(req, res) {
      try {
        const events = await service.getEvents();
        res.json(events);
      } catch (e) {
        res.status(e.status).send(e.desc);
      }
    },

    createEvent: async function(req, res) {
      try {
        req.body.owner = req.decodedUser.id;
        const newEvent = await service.createEvent(req.body);
        res.json(newEvent);
      } catch (e) {
        res.status(e.status).send(e.desc);
      }
    },
    getEvent: async function(req, res) {
      try {
        const event = await service.getEvent(req.params.eventId);
        res.json(event);
      } catch (e) {
        res.status(e.status).send(e.desc);
      }
    },
    getEventComments: async function(req, res) {
      console.log("comment event");
      console.log(req.body);
      console.log(req.params);
      res.send({});
    },
    commentEvent: async function(req, res) {
      try {
        req.body.target = req.params.eventId;
        req.body.author = req.decodedUser.id;
        const newComment = await service.commentEvent(req.body);
        res.json(newComment);
      } catch (e) {
        res.status(e.status).send(e.desc);
      }
    },
    commentComment: async function(req, res) {
      try {
        req.body.target = req.params.commentId;
        req.body.author = req.decodedUser.id;
        const newComment = await service.commentComment(req.body);
        res.json(newComment);
      } catch (e) {
        res.status(e.status).send(e.desc);
      }
    },
    getComment: async function(req, res) {
      try {
        const comment = await service.getComment(req.params.commentId);
        res.json(comment);
      } catch (e) {
        res.status(e.status).send(e.desc);
      }
    },
    getCommentComments: async function(req, res) {
      console.log("comment comments");
      console.log(req.body);
      console.log(req.params);
      res.send({});
    },
    likeEvent: function(req, res) {
      console.log("like event");
      console.log(req.body);
      console.log(req.params);
      res.send({});
    },
    likeComment: function(req, res) {
      console.log("like event");
      console.log(req.body);
      console.log(req.params);
      res.send({});
    },
  }
}
