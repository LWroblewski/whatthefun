module.exports = class CommentDTO {

  constructor(comment) {
    this.id = comment._id;
    this.author = comment.author;
    this.content = comment.content;
    this.likes = comment.likes;
    this.writtenDate = comment.written_date;
    this.target = comment.target;
    this.comments = comment.comments;
  }
  getId() {
    return this.id;
  }
  getAuthor() {
    return this.author;
  }
  getContent() {
    return this.content;
  }
  getLikes() {
    return this.likes;
  }
  getWrittenDate() {
    return this.writtenDate;
  }
  getComments() {
    return this.comments;
  }
  getTarget() {
    return this.target;
  }
}
