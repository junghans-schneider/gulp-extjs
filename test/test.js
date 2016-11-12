var assert = require('assert');
//var es = require('event-stream');
var vfs = require('vinyl-fs');
var extjs = require('../');

describe('gulp-extjs', function() {
    describe('in buffer mode', function() {

        it('should resolve Ext projext', function(done) {

            var myExtjs = extjs();

            vfs.src([ 'test/testproject/app.js', 'test/testproject/extjs/ext-fake.js' ])
                .pipe(myExtjs);

            myExtjs.on('data', function(file) {
                // make sure it came out the same way it went in
                assert(file.isBuffer());

                var relativePath = file.history[0].substring(file.cwd.length + 1); // +1 for the `/`
                console.log('## file: ' + relativePath);

                // check the contents
                //assert.equal(file.contents.toString('utf8'), 'prependthisabufferwiththiscontent');
            });

            myExtjs.once('end', function() {
                done();
            });

        });

    });
});
