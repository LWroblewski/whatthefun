const mongoose = require("mongoose");
const grid = require('gridfs-stream');
grid.mongo = mongoose.mongo;
var multer = require('multer');
const config = require("../../config");
var storage = require('multer-gridfs-storage')({
    url: config.database
});

module.exports = function (app) {
    var gfs = grid(mongoose.connection.db);
    var storage = GridFsStorage({
        gfs: gfs,
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
        },
        /** With gridfs we can store aditional meta-data along with the file */
        metadata: function (req, file, cb) {
            cb(null, { originalname: file.originalname });
        },
        root: 'ctFiles' //root name for collection to store files into
    });
    console.log('FILEEEE');
    return {
        gfs: gfs,
        upload: multer({ //multer settings for single upload
            storage: storage
        }).single('file')
    };
};
