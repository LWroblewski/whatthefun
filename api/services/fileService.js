const errors = require("../errors/errors").errors;
const mongoose = require("mongoose");

module.exports = function (app) {
  const gfs = app.get("gridFs");
  return {
    getFile: function (req) {
      try {
        gfs.collection('file'); //set collection name to lookup into
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
            root: "file"
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
