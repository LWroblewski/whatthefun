module.exports = function (app) {
  const errors = require("../errors/errors").errors;
  const service = require("../services/notificationService")(app);
  const mongoose = require("mongoose");

  return {
    getNotifications: async function (req, res) {
      try {
        const userId = new mongoose.Types.ObjectId(req.decodedUser.id);
        const notifications = await service.getNotifications(userId);
        res.json(notifications);
      } catch (e) {
        res.status(e.status).send(e.desc);
      }
    },

    readNotifications: async function (req, res) {
      try {
        const userId = new mongoose.Types.ObjectId(req.decodedUser.id);
        await service.readNotifications(req.body.notificationIds, userId);
        res.send();
      } catch (e) {
        res.status(e.status).send(e.desc);
      }
    }
  }
}
