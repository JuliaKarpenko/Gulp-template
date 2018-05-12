var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    browserSync  = require('browser-sync'),
    jshint       = require('gulp-jshint'),
    concat       = require('gulp-concat'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss    = require('gulp-minify-css'),
    uglify       = require('gulp-uglifyjs'),
    rename       = require('gulp-rename'),
    svgstore     = require('gulp-svgstore'),
    inject       = require('gulp-inject'),
    fileinclude  = require('gulp-file-include');
    concat       = require('gulp-concat');

gulp.task('fileinclude', function() {
    gulp.src([
        'app/view/*.html'
        ])
        .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file'
        }))
        .pipe(gulp.dest('app'))
        .pipe(browserSync.reload({stream: true}))
    });

gulp.task('svgstore', function () {
    var svgs = gulp
        .src('app/img/icons/*.svg') 
        .pipe(svgstore({ inlineSvg: true }));

    function fileContents (filePath, file) {
        return file.contents.toString();
    }
    return gulp
        .src('app/view/assets/svg-sprite.html')
        .pipe(inject(svgs, { transform: fileContents }))
        .pipe(gulp.dest('app/view/assets'));
});

gulp.task('sass', function() {
    return gulp.src('app/view/*.scss')
        .pipe(sass())
        .pipe(minifycss())
        .pipe(concat('all.css'))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'app',
            index: "index.html"
        },
        notify: false
    });
});

gulp.task('common-js', function() {
    return gulp.src('app/view/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('common.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/js'));
});

gulp.task('scripts', ['common-js'], function() {
    return gulp.src([
        'app/js/vendor/jquery-3.2.1.min.js',
        'app/view/**/*.js'
        ])
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest('app/js'));
});

gulp.task('watch', ['browser-sync'], function() {
    gulp.watch('app/view/*.html', ['fileinclude', browserSync.reload]);
    gulp.watch('app/view/**/*.scss', ['sass']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/view/**/*.html', ['fileinclude', browserSync.reload]);
    gulp.watch('app/js/**/*.js', ['scripts', browserSync.reload]);
    gulp.watch('app/view/**/*.js', ['scripts', browserSync.reload]);
});

gulp.task('build', ['sass', 'scripts'], function() {

    var buildCss = gulp.src([
        'app/css/main.min.css'
    ])
    .pipe(gulp.dest('dist/css'))

    var buildFonts = gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))

    var buildJs = gulp.src('app/js/main.min.js')
    .pipe(gulp.dest('dist/js'))

    var buildHtml = gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));

    var buildPhp = gulp.src('app/*.php')
    .pipe(gulp.dest('dist'));

})

gulp.task('default', ['watch']);
