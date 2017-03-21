/**
 * Created by cimacastdev on 3/21/17.
 */
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');

gulp.task('scripts', function() {

    gulp
        .src([
            './bower_components/video.js/dist/video.js',
            './assets/js/ads.js',
            './bower_components/videojs-contrib-ads/src/videojs.ads.js',
            './bower_components/videojs-ima/src/videojs.ima.js'
        ])
        .pipe(sourcemaps.init()) // create sourcemaps for your code
        .pipe(concat('index.js')) // create one js file for example index.js
        .pipe(stripDebug()) // you can debug here
        .pipe(uglify()) // minify your js file
        .pipe(sourcemaps.write('maps/')) // sourcemap destination
        .pipe(gulp.dest('scripts/')); // destination of your js file

});