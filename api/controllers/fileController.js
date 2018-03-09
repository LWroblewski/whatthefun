const errors = require("../errors/errors").errors;
const mongoose = require("mongoose");

module.exports = function (app) {
  const service = require("../services/fileService")(app);
  const upload = app.get("upload");
  const gfs = app.get("gridFs");
  return {
    upload: function (req, res) {
      try {
        upload(req, res, function (err) {
          if (err) {
            res.status(errors.default.DEFAULT.status).send(errors.default.DEFAULT.desc);;
          }
          console.log(req.file);
          return res.json({ fileId: req.file.id });
        });
      } catch (e) {
        console.log(e);
        res.status(e.status).send(e.desc);
      }
    },
    getFile: function (req, res) {
      try {
        gfs.collection('files'); //set collection name to lookup into
        /** First check if file exists */
        gfs.files.find({ filename: new mongoose.Types.ObjectId(req.params.id) }).toArray(function (err, files) {
          console.log(files);
          if (!files || files.length === 0) {
            return res.status(404).json({
              responseCode: 1,
              responseMessage: "error"
            });
          }
          /** create read stream */
          var readstream = gfs.createReadStream({
            filename: files[0].filename,
            root: "file"
          });
          /** set the proper content type */
          res.set('Content-Type', files[0].contentType)
          /** return response */
          return res.send();
        });
      } catch (e) {
        console.log(e);
        res.status(e.status).send(e.desc);
      }
    }
  }
}
