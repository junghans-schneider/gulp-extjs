'use strict';

var extend = require('util')._extend;
var path = require('path');
var fs = require('fs');

var extdeps = require('extjs-dependencies');
var Vinyl = require('vinyl');
var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

const PLUGIN_NAME = 'gulp-extjs';


// plugin level function (dealing with files)
function gulpExtjs(options) {

    var entryFiles = [];

    // creating a stream through which each file will pass
    var stream = through.obj(
        function(file, encoding, callback) {
            if (file.isStream()) {
                this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
                return callback();
            }

            if (file.isBuffer()) {
                entryFiles.push({
                    vinylFile: file,
                    encoding: encoding
                });
            }

            callback();
        },
        function(callback) {
            var me = this;

            if (entryFiles.length == 0) {
                me.emit('error', new PluginError(PLUGIN_NAME, 'No entry files provided'));
            }

            var cwd = entryFiles[0].vinylFile.cwd;

            var entryFilePaths = [],
                entryFilesByPath = {};

            entryFiles.forEach(function (entryFile) {
                var path = getRelativePathOfVinylFile(entryFile.vinylFile);

                entryFilePaths.push(path);
                entryFilesByPath[path] = entryFile;
            });

            var opts = extend({}, options); // Create a shallow copy
            opts.fileProvider = createVinylFileProvider(cwd, entryFilesByPath);
            opts.entry = entryFilePaths;

            try {
                var extFileInfos = extdeps.resolve(opts);
                extFileInfos.forEach(function(fileInfo) {
                    me.push(fileInfo.content.vinylFile);
                });
            } catch (e) {
                me.emit('error', new PluginError(PLUGIN_NAME, e));
            }

            callback();
        });

    // returning the file stream
    return stream;
}


function getRelativePathOfVinylFile(file) {
    return file.path.substring(file.cwd.length + 1); // +1 for the `/`
}


function createVinylFileProvider(cwd, entryFilesByPath) {

    return {

        /**
         * Returns an object representing the content of a file.
         *
         * @param rootPath {string} the root path of the project
         * @param filePath {string} the path of the file (relative to rootPath)
         * @param encoding {string?} the encoding to use (is null if a default should be used)
         * @return {object} an object representing the content.
         */
        createFileContent: function (rootPath, filePath, encoding) {
            var entryFile = entryFilesByPath[filePath];
            if (entryFile) {
                return entryFile;
            } else {
                var fullFilePath = path.resolve(cwd, rootPath, filePath);

                var vinylFile = new Vinyl({
                    cwd: cwd,
                    base: path.basename(fullFilePath),
                    path: fullFilePath,
                    contents: fs.readFileSync(fullFilePath)
                });

                return {
                    vinylFile: vinylFile,
                    encoding: encoding
                };
            }
        },

        /**
         * Returns the content of a file as string.
         *
         * @param content {object} the object representing the file content
         * @returns {string} the content
         */
        getContentAsString: function (content) {
            return content.vinylFile.contents.toString(content.encoding || 'utf8');
        }

    };

}


// exporting the plugin main function
module.exports = gulpExtjs;
