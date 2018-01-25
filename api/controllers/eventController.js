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
    getEvent: function(req, res) {
      console.log("getEvent");
      console.log(req.params);
      res.send({});
    },
    commentEvent: function(req, res) {
      console.log("comment event");
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
  }
}
