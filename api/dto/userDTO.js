module.exports = class UserDTO {
  constructor(user) {
    this.id = user._id;
    this.login = user.login;
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.birthdate = user.birthdate;
    this.team = user.team;
    this.admin = user.admin;
    this.imageUrl = user.imageUrl;
    this.pseudo = user.pseudo;
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
  isAdmin() {
    return this.admin;
  }
  getImageUrl() {
    return this.imageUrl;
  }
  getPseudo() {
    return this.pseudo;
  }
}
