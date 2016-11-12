'use strict';

var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

// consts
const PLUGIN_NAME = 'gulp-extjs';

// plugin level function (dealing with files)
function gulpExtjs(prefixText) {

    // creating a stream through which each file will pass
    var stream = through.obj(function(file, encoding, callback) {
        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
            return callback();
        }

        if (file.isBuffer()) {
            //file.contents = Buffer.concat([prefixText, file.contents]);
        }

        // make sure the file goes through the next gulp plugin
        this.push(file);

        // tell the stream engine that we are done with this file
        callback();
    });

    // returning the file stream
    return stream;
}

// exporting the plugin main function
module.exports = gulpExtjs;
