var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var historyApiFallback = require('connect-history-api-fallback');
var browserify = require('browserify');
var watchify = require('watchify');
var resolve = require('resolve');
var glob = require('glob').sync;
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var rename = require('gulp-rename');
var ghPages = require('gulp-gh-pages');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');

var baseDir = './admin';
var srcDir = baseDir + '/src';
var distDir = baseDir + '/dist';
var stylesDir = srcDir + '/styles';
var scriptsDir = srcDir + '/scripts';

var frontendDependencies = [
  'jquery',
  'bootstrap',
  'superagent',
  'csv'
];


function scriptPipeline(bundle, outfile) {

  /**
   * Run and return the scripts pipeline on bundle
   */

  console.log('Bundling: ' + outfile);

  return bundle
           .pipe(source(outfile))
           .pipe(buffer())
           .pipe(uglify())
           .pipe(gulp.dest(distDir));

}

gulp.task('deploy', function() {

  /**
   * Write the dist files to a gh-pages branch and push to remote
   */

  return gulp.src(distDir + '/*')
    .pipe(ghPages({
      message: "Web App update. " + Date.now()
    }));

});


gulp.task('serve', function() {

  /**
   * Run a reloading server for local development.
   */

  browserSync({
    open: false,
    server: {
        baseDir: distDir
        // use this for apps with client side routing
        // middleware: [historyApiFallback]
    }
  });

});


gulp.task('vendor-scripts', function () {

  /**
   * Provide frontend dependencies as a single bundle.
   */

  var bundler = browserify({});

  frontendDependencies.forEach(function (id) {
    bundler.require(resolve.sync(id), {expose: id});
  });

  return scriptPipeline(bundler.bundle(), 'vendor.min.js');

});


gulp.task('app-scripts', function() {

  /**
   * Provide frontend app as a single bundle.
   */

  var bundler = browserify({
        entries: [
            scriptsDir + '/app.js',
            // glob(scriptsDir + '/components/*.js')
        ],
        // transform: [],
        debug: true,
        cache: {},
        packageCache: {},
        fullPaths: true
  });

  // Don't include vendor dependencies in this bundle
  bundler.external(frontendDependencies);

  var watcher  = watchify(bundler);

  watcher
    .on('update', function() {
      scriptPipeline(watcher.bundle(), 'app.min.js');
    });

  return scriptPipeline(watcher.bundle(), 'app.min.js')
           .pipe(reload({stream: true}));

});


gulp.task('styles', function () {

  /**
   * Provide frontend styles as a single bundle.
   */

  gulp
    .src(stylesDir + '/app.css')
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(rename('app.min.css'))
    .pipe(gulp.dest(distDir));

});


gulp.task('default', ['vendor-scripts', 'app-scripts', 'styles', 'serve']);
