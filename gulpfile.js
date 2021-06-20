const gulp         = require('gulp')
const del          = require('del')
const concat       = require('gulp-concat')
const autoprefixer = require('gulp-autoprefixer')
const cleanCSS     = require('gulp-clean-css')
const sourcemaps   = require('gulp-sourcemaps')
const browserSync  = require('browser-sync').create()
const gulpIf       = require('gulp-if')
const gcmq         = require('gulp-group-css-media-queries')
const webp         = require('gulp-webp')
const less         = require('gulp-less')

let isDev  = process.argv.includes('--dev')
let isProd = !isDev

function clean() {
    return del('./build/*')
}

function html() {
    return gulp.src('./src/**/*.html')
               .pipe(gulp.dest('./build'))
               .pipe(browserSync.stream())
}

function style() {
    return gulp
        .src('./src/less/main.less')
        .pipe(gulpIf(isDev, sourcemaps.init()))
        .pipe(less())
        .pipe(concat('bundle.min.css'))
        .pipe(autoprefixer())
        .pipe(gulpIf(isProd, cleanCSS({
            level: 2
        })))
        .pipe(gulpIf(isDev, sourcemaps.write('.')))
        .pipe(gulp.dest('./build/css'))
        .pipe(browserSync.stream())
}

function script() {
    return gulp.src('./src/js/**/*.js')
        .pipe(gulp.dest('./build/js'))
}

function imageToWebp() {
    return gulp.src('./src/img/**/*')
        .pipe(webp())
        .pipe(gulp.dest('./build/img'))
}

function image() {
    return gulp.src('./src/img/**/*')
        .pipe(gulp.dest('./build/img'))
}

function fonts() {
    return gulp.src('./src/fonts/**/*')
        .pipe(gulp.dest('./build/fonts'))
}

function watch() {
    browserSync.init({
        server: {
            baseDir: "./build/"
        }
    })
    gulp.watch('./src/**/*.html', html)
    gulp.watch('./src/less/**/*.less', style)
}

let build = gulp.parallel(html, style, script, image, imageToWebp, fonts)
let buildWithClean = gulp.series(clean, build)
let dev = gulp.series(buildWithClean, watch)

gulp.task('build', buildWithClean)
gulp.task('dev', dev)