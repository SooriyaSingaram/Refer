// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    autoprefix = require('gulp-autoprefixer'),
    minifyCSS = require('gulp-clean-css'),
    changed = require('gulp-changed'),
    imagemin = require('gulp-imagemin'),
    inject = require('gulp-inject'),
    bowerFiles = require('main-bower-files'),
    stylus = require('gulp-stylus'),
    es = require('event-stream'),
    wiredep = require('wiredep');
    webpack = require('webpack-stream');



// Lint Task
gulp.task('lint', function() {
    return gulp.src('public/app/modules/**/*.*')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});



// Task to run all minified file paths to index.html
gulp.task('index', function() {
    var target = gulp.src('public/index.html');
    var sources = gulp.src(['public/build/scripts/*.js', 'public/build/styles/*.css'], {
        read: false
    });

    return target.pipe(inject(sources))
        .pipe(gulp.dest('public/src'));
});

// Task to get all bower dependencies along with bower css to index.html

gulp.task('bower', function() {
    var bowerFiles = require('main-bower-files'),
        inject = require('gulp-inject'),
        stylus = require('gulp-stylus'),
        es = require('event-stream');

    var cssFiles = gulp.src('./public/src/**/*.styl')
        .pipe(stylus())
        .pipe(gulp.dest('./public/build'));

    gulp.src('./public/src/index.html')
        .pipe(inject(gulp.src(bowerFiles(), {
            read: false
        }), {
            name: 'bower'
        }))
        .pipe(inject(es.merge(
            cssFiles,
            gulp.src('./public/src/app/**/*.js', {
                read: false
            })
        )))
        .pipe(gulp.dest('./public/build'));
});



// CSS concat, auto-prefix and minify
gulp.task('styles', function() {
    gulp.src(['public/src/styles/*.css'])
        .pipe(concat('style.css'))
        .pipe(autoprefix('last 2 versions'))
        .pipe(minifyCSS())
        .pipe(gulp.dest('public/build/styles/'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('public/src/scripts/*.js')
        .pipe(concat('all.js'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('public/build/scripts/'));
});

// minify new images
gulp.task('imagemin', function() {
    var imgSrc = 'public/src/images/**/*',
        imgDst = 'public/build/images';

    gulp.src(imgSrc)
        .pipe(changed(imgDst))
        .pipe(imagemin())
        .pipe(gulp.dest(imgDst));
});

// Watching Files For Changes
gulp.task('watch', function() {
    gulp.watch('public/app/modules/**/*.js', ['lint']);
    //gulp.watch('public/app/js/*.js', ['scripts']);

});

// Default Task
gulp.task('default', ['lint', 'bower', 'watch']);