module.exports = function(app) {
  const errors = require("../errors/errors").errors;
  const service = require("../services/teamService")(app);

  return {
    getTeams: function(req, res) {
      service.getTeams(function(err, teams) {
        if (err) {
          res.status(err.status).send(err.desc);
        }
        res.json(teams);
      });
    },
    createTeam: function(req, res) {
      service.createTeam(req.body, function(err, team) {
        if (err) {
          res.status(err.status).send(err.desc);
        } else {
          res.status(201).json(team);
        }
      });
    },
    getTeam: function(req, res) {

      service.getTeam(req.params.teamId, function(err, team) {
        if (err) {
          res.status(err.status).send(err.desc);
        } else {
          res.json(team);
        }
      });

    },
    addUserInTeam: function(req, res) {
      if ((req.decodedUser && req.body && (req.decodedUser._id == req.body.userId)) || req.decodedAdmin) {

        service.addUserInTeam(req.body.userId, req.params.teamId, function(err, team) {
          if (err) {
            res.status(err.status).send(err.desc);
          } else {
            res.json(team);
          }
        });

      } else {
        console.log(errors.default.FORBIDDEN);
        let err = errors.default.FORBIDDEN;
        res.status(err.status).send(err.desc);
      }
    }

  }
}
