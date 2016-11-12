gulp-extjs [![NPM version][npm-image]][npm-url]
==========

A gulp plugin which resolves and sorts all dependencies of an Ext JS project.

**Features:**

  - Build your Ext JS project without having to use the sencha tools.
  - Only includes the source files you really need.
  - Sorts your source files in the right order.

**You don't use gulp?**  
Check out [extjs-dependencies](https://github.com/junghans-schneider/extjs-dependencies) - the
Ext resolver without dependencies to any particular build system.


Basic usage
-----------

Install `gulp-extjs` in your project:

    npm install --save-dev gulp-extjs

Then add it to your `gulpfile.js`:

~~~javascript
var gulp       = require('gulp');
var extjs      = require('gulp-extjs');
var concat     = require('gulp-concat');

gulp.task('scripts', function(){
    return gulp.src([ 'ext/ext-dev.js', 'app.js' ])  // Only add the entry points to your app
        .pipe(extjs())                               // gulp-extjs will add all dependencies
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('build'));
});
~~~


Use a separate Ext JS script
----------------------------

If you prefer to load the Ext JS core using an extra script tag, you can exclude it from your build.

Example `gulpfile.js`:

~~~javascript
var gulp       = require('gulp');
var extjs      = require('gulp-extjs');
var concat     = require('gulp-concat');

gulp.task('scripts', function(){
    return gulp.src('app.js')                // Add all entry points to include with dependencies
        .pipe(extjs({
            provided: 'ext/ext-all-dev.js',  // Add Ext scripts you load independently in your html file
        }))
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('build'));
});
~~~


Create sourcemaps
-----------------

Example `gulpfile.js`:

~~~javascript
var gulp       = require('gulp');
var extjs      = require('gulp-extjs');
var sourcemaps = require('gulp-sourcemaps');
var concat     = require('gulp-concat');

gulp.task('scripts', function(){
    return gulp.src([ 'ext/ext-dev.js', 'app.js' ])  // Only add the entry points to your app
        .pipe(extjs())
        .pipe(sourcemaps.init())
        .pipe(concat('scripts.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build'));
});
~~~


All options
-----------

~~~javascript
gulp.task('scripts', function(){
    return gulp.src([ 'ext/ext-dev.js', 'app.js' ])  // Only add the entry points to your app
        .pipe(extjs({
            // Log verbose? Optional, default is false.
            verbose: false,

            // Source file encoding. Optional, default is 'utf8'
            encoding: 'utf8',

            // Add Ext JS scripts you load independently in your html file. Optional.
            provided: [ 'extjs/ext-dev.js' ],

            resolve: {
                // The source folders for each class name prefix. Optional.
                path: {
                    'Ext':   'ext/src',   // Search classes starting with `Ext.` in `ext/src`
                    'myapp': 'app'        // Search classes starting with `myapp.` in `app`
                },

                // Alternative class names. Optional.
                alias: {
                    'Ext.Layer': 'Ext.dom.Layer'
                }
            },

            // Extra dependencies. Optional.
            extraDependencies: {
                requires: {
                    'MyClass': 'MyDependency'
                },
                uses: {
                    'MyClass': 'MyDependency'
                }
            }

            // Classes to exclude. Optional.
            excludeClasses: ['Ext.*', 'MyApp.some.Class'],

            // Files to exclude (excludes also dependencies). Optional.
            skipParse: ['app/ux/SkipMe.js']
        }))
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('build'));
});
~~~


[npm-url]: https://www.npmjs.com/package/gulp-extjs
[npm-image]: https://img.shields.io/npm/v/gulp-extjs.svg
