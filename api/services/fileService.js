const errors = require("../errors/errors").errors;
const mongoose = require("mongoose");

module.exports = function (app) {
  const upload = app.get("upload");
  return {
    upload: async function (req, res) {
      try {
        const t = upload(req, res, function (err) {
          if (err) {
            return errors.default.DEFAULT;
          }
          return req.file.id;
        });
        console.log(t);
        return t;
      } catch (e) {
        throw errors.default.DEFAULT;
      }
    },
    getFile: function (req) {
      try {
        gfs.collection('ctFiles'); //set collection name to lookup into
        /** First check if file exists */
        gfs.files.find({ filename: req.params.filename }).toArray(function (err, files) {
          if (!files || files.length === 0) {
            return res.status(404).json({
              responseCode: 1,
              responseMessage: "error"
            });
          }
          /** create read stream */
          var readstream = gfs.createReadStream({
            filename: files[0].filename,
            root: "ctFiles"
          });
          /** set the proper content type */
          res.set('Content-Type', files[0].contentType)
          /** return response */
          return readstream.pipe(res);
        });
      } catch (e) {
        throw errors.default.DEFAULT;
      }
    }
  }
}
