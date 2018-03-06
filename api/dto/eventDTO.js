module.exports = class EventDTO {

  constructor(event) {
    this.id = event._id;
    this.author = event.author;
    this.status = event.status;
    this.title = event.title;
    this.shortDescription = event.shortDescription;
    this.longDescription = event.longDescription;
    this.likes = event.likes;
    this.type = event.event_type;
    this.comments = event.comments;
    this.createdDate = event.created_date;
    this.dueDate = event.due_date;
    this.members = event.target;

  }
  getId() {
    return this.id;
  }
  getTitle() {
    return this.title;
  }
  getAuthor() {
    return this.author;
  }
  getShortDescription() {
    return this.shortDescription;
  }
  getLongDescription() {
    return this.longDescription;
  }
  getLikes() {
    return this.likes;
  }
  getComments() {
    return this.comments;
  }
  getCreatedDate() {
    return this.createdDate;
  }
  getDueDate() {
    return this.dueDate;
  }
  getTargetType() {
    return this.targetType;
  }
  getMembers() {
    return this.members;
  }

}
