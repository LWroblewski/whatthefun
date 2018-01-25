module.exports = class EventDTO {

  constructor(event) {
    this.id = event._id;
    this.owner = event.owner;
    this.status = event.status;
    this.title = event.title;
    this.shortDesc = event.short_desc;
    this.longDesc = event.long_desc;
    this.likes = event.likes;
    this.type = event.event_type;
    this.comments = event.comments;
    this.createdDate = event.created_date;
    this.dueDate = event.due_date;
    this.target = event.target;
    this.targetType = event.target_type;

  }
  getId() {
    return this.id;
  }
  getTitle() {
    return this.title;
  }
  getOwner() {
    return this.owner;
  }
  getShortDesc() {
    return this.shortDesc;
  }
  getLongDesc() {
    return this.longDesc;
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
  getTarget() {
    return this.target;
  }

}
