var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var watch = require('gulp-watch')
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var notify = require("gulp-notify");
var uglify = require('gulp-uglify');

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['watch']);

gulp.task('watch', function(){
  gulp.watch('./assets/**/*.js',['scripts'], function(){
    notify('Compilado wey!');
  })
});

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('scripts', function(done){
  gulp.src('./assets/**/*.js')
    .pipe(concat('yoTeLlevo-min.js'))
    .on('error', err => { console.log(err) })
    .pipe(uglify())
    .pipe(gulp.dest('./www/js/'))
    .on('end', done);
});

gulp.task('watchSaas', ['sass'], function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
