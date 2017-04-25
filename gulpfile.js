/* jshint camelcase:false */

// Copyright (C) 2017 File Maps Web UI Authors.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

'use strict';

var gulp = require('gulp');
var del = require('del');
var merge = require('merge-stream');

var paths = require('./gulp.config.json');
var plugins = require('gulp-load-plugins')();
var exec = require('child_process').exec;

/**
 * List the available gulp tasks
 */
gulp.task('help', plugins.taskListing);

/**
 * Lint JavaScript code.
 * @return {Stream}
 */
gulp.task('analyze', function() {
    var jshint = analyzejshint([].concat(paths.js));
    var jscs = analyzejscs([].concat(paths.js));
    return merge(jshint, jscs);
});

/**
 * Create $templateCache from the html templates
 * Output is written to build/templates.js
 * @return {Stream}
 */
gulp.task('templatecache', function() {
    return gulp
        .src(paths.htmltemplates)
        .pipe(plugins.htmlmin({
            collapseWhitespace: true
        }))
        .pipe(plugins.angularTemplatecache('templates.js', {
            module: 'filemaps.core',
            standalone: false,
            root: 'filemaps/'
        }))
        .pipe(gulp.dest(paths.build));
});

/**
 * Minify and bundle application JavaScript files
 * @return {Stream}
 */
gulp.task('js', ['analyze', 'templatecache'], function() {
    var source = [].concat(paths.js, paths.build + 'templates.js');
    return gulp
        .src(source)
        .pipe(plugins.concat('filemaps.min.js'))
        .pipe(plugins.ngAnnotate({
            add: true,
            single_quotes: true
        }))
        .pipe(plugins.bytediff.start())
        .pipe(plugins.uglify({
            mangle: true
        }))
        .pipe(plugins.bytediff.stop(bytediffFormatter))
        .pipe(gulp.dest(paths.build));
});

/**
 * Copy the vendor JavaScript
 * @return {Stream}
 */
gulp.task('vendorjs', function() {
    return gulp
        .src(paths.vendorjs)
        .pipe(plugins.concat('vendor.min.js'))
        .pipe(plugins.bytediff.start())
        //.pipe(plugins.uglify())
        .pipe(plugins.bytediff.stop(bytediffFormatter))
        .pipe(gulp.dest(paths.build));
});

/**
 * Minify and bundle the CSS
 * @return {Stream}
 */
gulp.task('css', function() {
    return gulp
        .src(paths.css)
        .pipe(plugins.concat('filemaps.min.css'))
        // modify font urls
        .pipe(plugins.replace("../../bower_components/oxygen-googlefont/", "../fonts/"))
        .pipe(plugins.replace("../fonts/roboto/", "../fonts/"))
        .pipe(plugins.autoprefixer('last 2 version', '> 5%'))
        .pipe(plugins.bytediff.start())
        .pipe(plugins.cssnano())
        .pipe(plugins.bytediff.stop(bytediffFormatter))
        .pipe(gulp.dest(paths.build + 'css'));
});

/**
 * Minify and bundle the vendor CSS
 * @return {Stream}
 */
gulp.task('vendorcss', function() {
    var vendorFilter = plugins.filter(['**/*.css']);
    return gulp
        .src(paths.vendorcss)
        .pipe(vendorFilter)
        .pipe(plugins.concat('vendor.min.css'))
        // modify font urls
        .pipe(plugins.replace("MaterialIcons-", "../fonts/MaterialIcons-"))
        .pipe(plugins.bytediff.start())
        .pipe(plugins.cssnano())
        .pipe(plugins.bytediff.stop(bytediffFormatter))
        .pipe(gulp.dest(paths.build + 'css'));
});

/**
 * Copy images
 * @return {Stream}
 */
gulp.task('images', function() {
    return gulp
        .src(paths.images)
        .pipe(gulp.dest(paths.build + 'images'));
});

/**
 * Copy fonts
 * @return {Stream}
 */
gulp.task('fonts', function() {
    return gulp
        .src(paths.fonts)
        .pipe(gulp.dest(paths.build + 'fonts'));
});

/**
 * Inject all the files into the new index.html
 * @return {Stream}
 */
gulp.task('rev-and-inject', ['js', 'vendorjs', 'css', 'vendorcss'], function() {
    var minified = paths.build + '**/*.min.*';
    var indexHtml = paths.app + 'index.html';
    var minFilter = plugins.filter(['**/*.min.*', '!**/*.map'], { restore: true });
    var indexHtmlFilter = plugins.filter('**/index.html', { restore: true });

    return gulp
        .src([].concat(minified, indexHtml)) // add all built min files and html file
        .pipe(minFilter) // filter the stream to minified css and js
        .pipe(plugins.rev()) // create files with rev's
        .pipe(plugins.revDeleteOriginal()) // delete orig files, leaving minified
        .pipe(gulp.dest(paths.build)) // write the ref files
        .pipe(minFilter.restore) // back to original stream

        // handle index.html
        .pipe(indexHtmlFilter)
        .pipe(inject('css/vendor.min.css', 'inject-vendor'))
        .pipe(inject('css/filemaps.min.css'))
        .pipe(inject('vendor.min.js', 'inject-vendor'))
        .pipe(inject('filemaps.min.js'))
        .pipe(gulp.dest(paths.build)) // write the rev files
        .pipe(indexHtmlFilter.restore) // back to original stream

        // replace files referenced in index.html with the rev'd files
        .pipe(plugins.revReplace()) // substitute in new filenames
        .pipe(gulp.dest(paths.build)) // write new index.html
        .pipe(plugins.rev.manifest()) // create the manifest
        .pipe(gulp.dest(paths.build)); // write rev-manifest.json
});

/**
 * Build the optimized application
 * @return {Stream}
 */
gulp.task('build', ['rev-and-inject', 'images', 'fonts'], function() {
    return gulp
        .src('')
        .pipe(plugins.notify({
            onLast: true,
            message: 'File Maps Web UI built!'
        }));
});

/**
 * Remove all files from the build folder
 * One way to run clean before all tasks is to run
 * from the cmd line: gulp clean && gulp build
 * @return {Stream}
 */
gulp.task('clean', function(cb) {
    var delPaths = [].concat(paths.build);
    del(delPaths, cb);
});

///////////////////////////////////////
// Util functions
// ////////////////////////////////////

/**
 * Execute JSHint on given source files
 * @param  {Array} sources
 * @param  {String} overrideRcFile
 * @return {Stream}
 */
function analyzejshint(sources, overrideRcFile) {
    var jshintrcFile = overrideRcFile || './.jshintrc';
    return gulp
        .src(sources)
        .pipe(plugins.jshint(jshintrcFile))
        .pipe(plugins.jshint.reporter('jshint-stylish'));
}

/**
 * Execute JSCS on given source files
 * @param  {Array} sources
 * @return {Stream}
 */
function analyzejscs(sources) {
    return gulp
        .src(sources)
        .pipe(plugins.jscs('./.jscsrc'));
}

/**
 * Formatter for bytediff to display the size changes after processing
 * @param  {Object} data - byte data
 * @return {String}      Difference in bytes, formatted
 */
function bytediffFormatter(data) {
    var difference = (data.savings > 0) ? ' smaller' : ' larger';
    return data.fileName + ' minified from ' +
        (data.startSize / 1000).toFixed(0) + ' kB to ' + (data.endSize / 1000).toFixed(0) + ' kB' +
        ' (' + formatPercent(1 - data.percent, 0) + '%' + difference + ')';
}

/**
 * Format a number as a percentage
 * @param  {Number} num       Number to format as a percent
 * @param  {Number} precision Precision of the decimal
 * @return {String}           Formatted percentage
 */
function formatPercent(num, precision) {
    return (num * 100).toFixed(precision);
}

function inject(path, name) {
    var pathGlob = paths.build + path;
    var options = {
        ignorePath: paths.build.substring(1),
        addRootSlash: false
    };
    if (name) {
        options.name = name;
    }
    return plugins.inject(gulp.src(pathGlob, { read: false }), options);
}
