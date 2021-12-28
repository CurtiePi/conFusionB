'use strict';

const { dest, parallel, series, src, watch } = require('gulp');
const sass = require('gulp-sass')(require('node-sass'));
const browserSync = require('browser-sync');
const del = require('del');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const usemin = require('gulp-usemin');
const rev = require('gulp-rev');
const cleanCss = require('gulp-clean-css');
const flatmap = require('gulp-flatmap');
const htmlmin = require('gulp-htmlmin');

function sassTask(cb) {
    return src('./css/*.scss')
           .pipe(sass().on('error', sass.logError))
           .pipe(dest('./css'));
}

function sassWatchTask(cb) {
    watch('./css/*.scss', parallel('sassTask'));
}

function browserSyncTask(cb) {
    var files = [
        './*.html',
        './css/*.css',
        './js/*.js',
        './img/*{png,jpg,gif}'
    ];

    browserSync.init(files, {
        server: {
            baseDir: './'
        }
    });
};

async function cleanTask(cb) {
    return del (['dist']);
}

function fontsTask(cb) {
    return src('./node_modules/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
        .pipe(dest('./dist/fonts'));
}

function imageTask(cb) {
    return src('img/*.{png,jpg,gif}')
        .pipe(imagemin({optimizationLevel: 3, progressive: true, interlaced: true }))
        .pipe(dest('./dist/img'));

}

function useminTask(cb) {
    return src('./*.html')
        .pipe(flatmap(function(stream, file){
            return stream
                .pipe(usemin({
                    css: [rev()],
                    html: [ function() { return htmlmin({collapseWhitespace: true })}],
                    js: [uglify(), rev()],
                    inlinejs: [uglify()],
                    inlinecss: [cleanCss(), 'concat']
                }))
                .pipe(dest('dist/'));
        }))
}

exports.buildTask = series(cleanTask, parallel(fontsTask, imageTask, useminTask)); 
exports.sassTask = sassTask;
exports.sassWatchTask = sassWatchTask;
exports.default = parallel(browserSyncTask, sassWatchTask);

