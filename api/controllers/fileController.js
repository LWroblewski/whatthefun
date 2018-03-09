const errors = require("../errors/errors").errors;

module.exports = function (app) {
  const service = require("../services/fileService")(app);

  return {
    upload: async function (req, res) {
      try {
        const fileId = await service.upload(req, res);
        res.json({ fileId: id });
      } catch (e) {
        res.status(e.status).send(e.desc);
      }
    },
    getFile: function (req, res) {
      try {
        service.getFile(req);
        res.json();
      } catch (e) {
        res.status(e.status).send(e.desc);
      }
    }
  }
}
