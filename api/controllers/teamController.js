module.exports = function(app) {
  const errors = require("../errors/errors").errors;
  // const service = require("../services/teamService")(app);

  return {
    getTeams: function(req, res) {
      console.log("get Teams");

    },
    createTeam: function(req, res) {
      console.log("Create team");
    },
    addUserInTeam: function(req, res) {
      console.log("Add user in team");
    }
  }
}
