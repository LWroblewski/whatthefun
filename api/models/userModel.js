module.exports = class User{
  constructor(login, pwd){
    this.login = login;
    this.pwd = pwd;
  }
  getLogin(){
    return this.login;
  }
  setLogin(login){
    this.login = login;
  }

  getFirstname(){
    return this.firstname;
  }
  setFirstname(firstname){
    this.firstname = firstname;
  }
  getLastname(){
    return this.lastname;
  }
  setLastname(lastname){
    this.lastname = lastname;
  }
}
