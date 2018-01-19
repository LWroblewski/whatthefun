module.exports = class UserDTO {

  constructor(user) {
    this.id = user._id;
    this.login = user.login;
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.birthdate = user.birthdate;
    this.team = user.team;
  }
  getId() {
    return this.id;
  }
  getLogin() {
    return this.login;
  }
  getFirstname() {
    return this.firstname;
  }
  getLastname() {
    return this.lastname;
  }
  getBirthdate() {
    return this.birthdate;
  }
  getTeam() {
    return this.team;
  }

}
