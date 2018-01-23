const Team = require("../models/teamModel");
const errors = require("../errors/errors").errors;
const TeamDTO = require("../dto/teamDTO.js");


module.exports = function(app) {
  const userService = require("./userService")(app);
  const getTeamByTeamName = function(name, callback) {
    Team.findOne({
      name: name
    }, function(err, team) {
      console.log(team);
      if (err) {
        console.error(err);
        callback(errors.default.NOT_FOUND);
      }
      if (!team) {
        callback(errors.default.NOT_FOUND);
      } else {
        callback(null, new TeamDTO(team));
      }

    });
  }
  return {

    getTeams: function(callback) {
      console.log("Get all teams");
      Team.find({}, function(err, teams) {
        if (err) {
          console.error(err);
          callback(errors.default.DEFAULT);
        }
        const teamsDto = [];
        for (let i = 0; i < teams.length; i++) {
          teamsDto.push(new TeamDTO(teams[i]));
        }
        callback(null, teamsDto);
      });
    },

    createTeam: function(team, callback) {
      console.log("Create team");

      if (team && team.name && team.leader) {
        getTeamByTeamName(team.name, function(err, exists) {
          if (exists) {
            callback(errors.default.ALREADY_EXISTS);
          } else {

            const newTeam = new Team(team);
            newTeam.save(function(err, team) {
              console.log(team);
              if (err) {
                console.error(err);
                callback(errors.default.DEFAULT);
              }
              callback(null, new TeamDTO(team));
            });
          }
        });
      }
    },

    getTeam: function(id, callback) {
      Team.findById(
        id,
        function(err, team) {
          if (err) {
            console.error(err);
            callback(errors.default.NOT_FOUND);
          }
          if (team) {
            callback(null, new TeamDTO(team));
          } else {
            callback(errors.default.NOT_FOUND);
          }

        });

    },

    addUserInTeam: function(userId, teamId, callback) {

      userService.getUser(userId, function(err, user) {
        if (err) {
          console.error(err);
          callback(errors.default.NOT_FOUND);
        } else if (!user) {
          callback(errors.default.NOT_FOUND);
        } else {
          if (user.getTeam()) {
            callback(errors.team.ALREADY_HAS_TEAM);
          } else {
            userService.updateUser({
              _id: userId,
              team: teamId
            }, user.admin, function(error, resp) {
              if (error) {
                console.error(error);
                callback(errors.default.NOT_FOUND);
              } else {
                Team.findById(teamId, function(terror, team) {
                  if (terror) {
                    console.error(terror);
                    callback(errors.default.NOT_FOUND);
                  } else if (!team) {
                    callback(errors.default.NOT_FOUND);
                  } else {
                    let members = team.members;
                    members.push(userId);

                    Team.update({
                      _id: teamId
                    }, {
                      members: members
                    }, function(fail, update) {
                      if (fail) {
                        console.log(fail);
                        callback(errors.default.DEFAULT);
                      } else {
                        console.log(update);
                        Team.findById(
                          teamId,
                          callback);
                      }
                    })
                  }
                })
              }
            });
          }
        }
      });
    }

  }

}


// module.exports.getUser = async function(){
//   const user = await User.findById("5a673aae1bd03f749c417db3");
//   return await user;
// }
