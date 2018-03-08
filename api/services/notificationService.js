const errors = require("../errors/errors").errors;
const Notification = require("../models/notificationModel");
const NotificationDTO = require("../dto/notificationDTO");
const mongoose = require("mongoose");

module.exports = function (app) {
  const userService = require("./userService")(app);
  const teamService = require("./teamService")(app);
  return {
    //  EVENTS

    getNotifications: async function (userId) {
      try {
        return Notification.aggregate([
          {
            $match: {
              receiver: {
                $in: [userId]
              }
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'sender',
              foreignField: '_id',
              as: 'sender'
            }
          },
          {
            $lookup: {
              from: 'events',
              localField: 'metadata.eventId',
              foreignField: '_id',
              as: 'event'
            }
          },
          {
            $project: {
              "_id": 1,
              "sender": { $arrayElemAt: ["$sender", 0] },
              "metadata": 1,
              "event": { $arrayElemAt: ["$event", 0] },
              "read_by": 1,
              "created_at": 1
            }
          }])
          .sort({ "created_date": -1 })
          .exec()
          .then(function (data) {
            return new Promise(function (resolve, reject) {
              const result = data.map(d => new NotificationDTO(d, userId));
              resolve(result);
            });
          }, function (error) {
            new Promise(function (resolve, reject) {
              reject(error);
            });
          });
      } catch (e) {
        throw errors.default.DEFAULT;
      }
    },

    readNotifications: async function (ids, userId) {
      if (ids && ids.length > 0 && userId) {
        try {
          for (let index = 0; index < ids.length; index++) {
            const notificationId = ids[index];
            
            console.log(notificationId);
            
            const notification = await Notification.findById(notificationId);
            console.log(notification);
            let readers = notification.read_by;
            console.log(readers);
            if (!readers.some(r => r.readerId.toString() === userId.toString())) {
              readers.push({
                readerId: userId
              });
            }
            const update = await Notification.update({
              _id: notificationId
            }, {
                read_by: readers
              });
          }
        } catch (e) {
          console.log(e);
          throw e;
        }
      } else {
        throw errors.default.BAD_PARAMS;
      }
    },

    addNotification: async function (notification) {
      if (notification && notification.sender && notification.metadata && notification.receiver) {
        try {
          const newNotification = new Notification(notification);
          const result = await newNotification.save();
          return new Promise(function (resolve, reject) {
            resolve(new NotificationDTO(result));
          });
        } catch (e) {
          throw e;
        }
      } else {
        throw errors.default.BAD_PARAMS;
      }
    }
  }

}
