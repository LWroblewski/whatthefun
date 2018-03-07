module.exports = class NotificationDTO {

  constructor(notification, userId) {
    this.id = notification._id;
    this.author = {
      id: notification.sender._id,
      pseudo: notification.sender.pseudo,
      imageUrl: notification.sender.imageUrl,
      team: notification.sender.team
    };
    this.event = {
      id: notification.event._id,
      title: notification.event.title,
      type: notification.event.event_type
    };
    this.isRead = notification.read_by.some(r => r.readerId === userId);
    this.createAt = notification.created_at;
    this.action = notification.metadata.action;
  }
  getId() {
    return this.id;
  }
  getAuthor() {
    return this.author;
  }
}
