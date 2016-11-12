var assert = require('assert');
var vfs = require('vinyl-fs');
var extjs = require('../');

describe('gulp-extjs', function() {
    describe('in buffer mode', function() {

        it('should resolve Ext projext', function(done) {
            var myExtjs = extjs({
                //verbose: true
            });

            vfs.src([ 'test/testproject/extjs/ext-fake.js', 'test/testproject/app.js' ])
                .pipe(myExtjs);

            var resultPaths = [];
            myExtjs.on('data', function(file) {
                // make sure it came out the same way it went in
                assert(file.isBuffer());

                var relativePath = file.path.substring(file.cwd.length + 1); // +1 for the `/`
                resultPaths.push(relativePath);
            });

            myExtjs.once('end', function() {
                assert.deepEqual([
                    'test/testproject/extjs/ext-fake.js',
                    'test/testproject/extjs/src/app/Application.js',
                    'test/testproject/extjs/src/view/View.js',
                    'test/testproject/app-src/view/MyView.js',
                    'test/testproject/app.js'
                ], resultPaths);

                done();
            });
        });

    });
});
