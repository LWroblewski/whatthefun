module.exports = function(app) {
  const errors = require("../errors/errors").errors;
  // const service = require("../services/teamService")(app);

  return {
    getEvents: function(req, res) {
      console.log("get events");
      res.send({});
    },
    createEvent: function(req, res) {
      console.log("Create event");
      res.send({});
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
