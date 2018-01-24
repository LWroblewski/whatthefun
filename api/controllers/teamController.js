module.exports = function(app) {
  const errors = require("../errors/errors").errors;
  const service = require("../services/teamService")(app);

  return {
    getTeams: async function(req, res) {
      try {
        const teams = await service.getTeams();
        res.json(teams);
      } catch (e) {
        res.status(e.status).send(e.desc);
      }
    },
    createTeam: async function(req, res) {
      try {
        const newTeam = await service.createTeam(req.body);
        res.json(newTeam);
      } catch (e) {
        res.status(e.status).send(e.desc);
      }
    },
    getTeam: async function(req, res) {
      try {
        const team = await service.getTeam(req.params.teamId);
        res.json(team);
      } catch (e) {
        res.status(e.status).send(e.desc);
      }
    },
    addUserInTeam: async function(req, res) {
      if ((req.decodedUser && req.body && (req.decodedUser._id == req.body.userId)) || req.decodedAdmin) {
        try {
          const team = await service.addUserInTeam(req.body.userId, req.params.teamId);
          res.status(204).send();
        } catch (e) {
          res.status(e.status).send(e.desc);
        }
      } else {
        let err = errors.default.FORBIDDEN;
        res.status(err.status).send(err.desc);
      }
    },
    removeUserFromTeam: async function(req, res) {
      if ((req.decodedUser && req.body && (req.decodedUser._id == req.body.userId)) || req.decodedAdmin) {
        try {
          const team = await service.removeUserFromTeam(req.body.userId, req.params.teamId);
          res.status(204).send();
        } catch (e) {
          res.status(e.status).send(e.desc);
        }
      } else {
        let err = errors.default.FORBIDDEN;
        res.status(err.status).send(err.desc);
      }
    },

    addPoints: async function(req, res) {
      try {
        const team = await service.addPointsToTeam(req.params.teamId, 3);
        res.json(team);
      } catch (e) {
        res.status(e.status).send(e.desc);
      }
    }

  }
}
