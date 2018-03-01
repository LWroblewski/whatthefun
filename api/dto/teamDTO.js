const UserDTO = require("./userDTO.js");

module.exports = class TeamDTO {

  constructor(team) {
    this.id = team._id;
    this.name = team.name;
    this.score = team.score;
    this.members = team.members.map(m => new UserDTO(m));
    this.leader = team.leader;
  }
  getId() {
    return this.id;
  }
  getName() {
    return this.name;
  }
  getScore() {
    return this.score;
  }
  getMembers() {
    return this.members;
  }
  getLeader() {
    return this.leader;
  }

}
