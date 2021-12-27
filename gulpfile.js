'use strict';

const { dest, parallel, series, src, watch } = require('gulp');
const sass = require('gulp-sass')(require('node-sass'));
const browserSync = require('browser-sync');

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


exports.sassTask = sassTask;
exports.sassWatchTask = sassWatchTask;
exports.default = parallel(browserSyncTask, sassWatchTask);

