'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    include = require('gulp-file-include'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('rigger'),
    cssmin = require('gulp-minify-css'),
    cssnano = require('cssnano'),
    plumber = require('gulp-plumber'),
	notify = require('gulp-notify'),
    rename = require('gulp-rename'),
    postcss = require('gulp-postcss'),
    imagemin = require('gulp-imagemin'),
    imageminOptipng = require('imagemin-optipng'),
    pngquant = require('imagemin-pngquant'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    rimraf = require('rimraf'),
    ignore = require('gulp-ignore'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;



var path = {
    build: {
        html: 'docs/',
        js: 'docs/js/',
        libs: 'docs/libs/',
        css: 'docs/css/',
        img: 'docs/images/',
        fonts: 'docs/fonts/'
    },
    src: {
        html: ['src/*.html'],
        libs: 'src/libs/**/*.*',
        js: 'src/js/**/*.*',
        style: 'src/scss/form100uah.scss',
        img: 'src/images/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/scss/**/*.scss',
        img: 'src/images/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './docs'
};



var config = {
    server: {
        baseDir: "./docs"
    },
    // tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "mafia-100uah"
};

var onError = function(err) {
	notify.onError({
		title: "Gulp error in " + err.plugin,
		message: err.toString()
	})(err);
	this.emit('end');
};

gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(include({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});

gulp.task('style:build', function () {
    gulp.src(path.src.style)
	    .pipe(plumber({ errorHandler: onError }))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sass())
        .pipe(prefixer({
            browsers: ['last 12 versions']
        }))
        .pipe(cssmin())
        .pipe(sourcemaps.write('.'))
        // .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
    gulp.src(path.src.img)
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
});

gulp.task('libs:build', function() {
    gulp.src(path.src.libs)
        .pipe(gulp.dest(path.build.libs))
});


gulp.task('js:build', function() {
    gulp.src(path.src.js)
        .pipe(uglify())
        .pipe(gulp.dest(path.build.js))
});

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('clean', function (cb) {
    return gulp.src(path.clean, {read:false})
        .pipe(ignore('docs/js/libs/**/*.js'))
        .pipe(ignore('docs/libs/**/*.*'))
        .pipe(ignore('docs/css/vendor/**/*.css'))
        .pipe(rimraf());

});

gulp.task('build', [
    'html:build',
    'libs:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build'
]);

gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch('package.json', function(event, cb) {
        gulp.start('libs:build');
    });
    watch([path.watch.js], function(event, cb) {
         gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('default', ['build', 'webserver', 'watch']);
