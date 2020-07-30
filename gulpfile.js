
const gulp = require('gulp');
const sass = require('gulp-sass');
const cleanCss = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin')
const ghpages = require("gh-pages")
const { watch, parallel } = require('gulp');

sass.compiler = require('node-sass')

function runSass(cb) {
  // we want to run "sass css/app/scss app.css --watch"
    gulp.src('src/css/app.scss')
    .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(cleanCss({compatibility: 'ie8'}))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('dist'))
      .pipe(browserSync.stream())
      cb();
}

function HTML(cb) {
    gulp.src('src/*.html')
    .pipe(gulp.dest('dist'))

    cb();
}

function images(cb){
    gulp.src('src/img/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'))

    cb();
}

function fonts(cb){
    gulp.src('src/fonts/*')
    .pipe(gulp.dest('dist/fonts'))

    cb();
}

function Sync(cb){
    browserSync.init({
        server: {
            baseDir: ('dist')
        }
    })

    cb();
}

exports.deploy = function (cb) {
    ghpages.publish('dist') 

    cb();
}

exports.default = function () {
    watch('src/css/app.scss', runSass);
    watch('src/*.html', parallel(HTML, fonts, images, Sync)).on('change', browserSync.reload); 
    

    
};
