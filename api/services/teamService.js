const Team = require("../models/teamModel");
const errors = require("../errors/errors").errors;
const TeamDTO = require("../dto/teamDTO.js");


module.exports = function(app) {
  const userService = require("./userService")(app);
  const getTeamByTeamName = async function(name) {
    try {
      const team = await Team.findOne({
        name: name
      });
      return new TeamDTO(team);
    } catch (e) {
      throw errors.default.NOT_FOUND;
    }
  }
  return {

    getTeams: async function() {
      try {
        return Team.aggregate([
          {
            $match: {}
          },
          {
            $lookup: {
              from: 'users',
              localField: 'members',
              foreignField: '_id',
              as: 'members'
            }
          },
          {
            $project: {
              "_id": 1,
              "leader": 1,
              "name": 1,
              "code": 1,
              "imageUrl": 1,
              "score": 1,
              "members._id": 1,
              "members.pseudo" : 1,
              "members.imageUrl" : 1
            }
          }
        ]).exec()
          .then(function (data) {
            return new Promise(function (resolve, reject) {
              const result = data.map(d => new TeamDTO(d));
              resolve(result);
            });
          }, function (error) {
            reject(err);
          });
      } catch (e) {
        throw errors.default.DEFAULT;
      }
    },

    createTeam: async function(team) {
      if (team && team.name && team.leader) {
        let exists = false;
        try {
          const existingTeam = await getTeamByTeamName(team.name);
          exists = true;
          throw errors.default.ALREADY_EXISTS;
        } catch (e) {
          if (exists) {
            throw e;
          } else {
            const newTeam = new Team(team);
            const result = await newTeam.save();
            return this.getTeam(result._id);
          }
        }
      }
    },

    addUserInTeam: async function(userId, teamId) {
      try {
        const user = await userService.getUser(userId);
        const team = await this.getTeam(teamId);
        if (user.getTeam()) {
          throw errors.team.ALREADY_HAS_TEAM;
        }
        const updating = await userService.updateUser({
          _id: userId,
          team: teamId
        }, user.admin);
        let members = team.members
        if (!members.includes(userId)) {
          members.push(userId);
        }

        const result = await Team.update({
          _id: teamId
        }, {
          members: members
        });
        return new TeamDTO(result);
      } catch (e) {
        throw e;
      }
    },

    removeUserFromTeam: async function(userId, teamId) {
      try {
        const user = await userService.getUser(userId);
        const team = await this.getTeam(teamId);
        if (!user.getTeam()) {
          throw errors.team.HAS_NO_TEAM;
        }
        const updating = await userService.updateUser({
          _id: userId,
          team: ""
        }, user.admin);
        let members = team.members
        if (members.includes(userId)) {
          const index = members.indexOf(userId);
          members.splice(index, 1);
        }

        const result = await Team.update({
          _id: teamId
        }, {
          members: members
        });
        return new TeamDTO(result);
      } catch (e) {
        throw e;
      }
    },

    getTeam: async function(id) {
      try {
        return Team.aggregate([
          {
            $match: { 
              _id: new mongoose.Types.ObjectId(id)
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'members',
              foreignField: '_id',
              as: 'members'
            }
          },
          {
            $project: {
              "_id": 1,
              "leader": 1,
              "name": 1,
              "code": 1,
              "imageUrl": 1,
              "score": 1,
              "members._id": 1,
              "members.pseudo" : 1,
              "members.imageUrl" : 1
            }
          }
        ]).exec()
          .then(function (data) {
            return new Promise(function (resolve, reject) {
              const result = data.map(d => new TeamDTO(d));
              resolve(result);
            });
          }, function (error) {
            reject(err);
          });
      } catch (e) {
        throw errors.default.NOT_FOUND;
      }
    },

    addPointsToTeam: async function(id, points) {
      try {
        const team = await Team.findById(id);
        team.score += points;
        const result = await Team.update({
          _id: id
        }, {
          score: team.score
        });
        return new TeamDTO(team);
      } catch (e) {
        throw errors.default.NOT_FOUND;
      }
    }


  }

}
