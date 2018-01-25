module.exports = class LikeDTO {

  constructor(like) {
    this.id = like._id;
    this.user = like.user;

  }
  getId() {
    return this.id;
  }
  getUser() {
    return this.user;
  }
}
