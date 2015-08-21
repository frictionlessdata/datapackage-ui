var _ = require('underscore');
var gulp = require('gulp');
var historyApiFallback = require('connect-history-api-fallback');
var browserify = require('browserify');
var depcheck = require('depcheck');
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
var path = require('path');
var streamqueue = require('streamqueue');

var baseDir = './datapackagist';
var srcDir = baseDir + '/src';
var distDir = baseDir + '/dist';
var stylesDir = srcDir + '/styles';
var scriptsDir = srcDir + '/scripts';
var frontendDependencies = _.keys(require('./package.json').dependencies);


/**
 * Provide frontend app as a single bundle.
 */

var bundler = browserify({
  entries: [
      scriptsDir + '/app.js',
      // glob(scriptsDir + '/components/*.js')
  ],
  transform: ['browserify-handlebars'],
  debug: true,
  cache: {},
  packageCache: {},
  fullPaths: true
});

// Don't include vendor dependencies in this bundle
bundler.external(frontendDependencies);

function scriptPipeline(bundle, outfile, options) {

  /**
   * Run and return the scripts pipeline on bundle
   */

  console.log('Bundling: ' + outfile);

  var outBundle = bundle.pipe(source(outfile)).pipe(buffer());

  if(options && options.uglify)
    outBundle = outBundle.pipe(uglify());

  return outBundle.pipe(gulp.dest(distDir));
}


gulp.task('vendor-scripts', function () {

  /**
   * Provide frontend dependencies as a single bundle.
   */

  var bundler = browserify({});

  frontendDependencies.forEach(function (id) {
    bundler.require(resolve.sync(id), {expose: id});
  });

  return scriptPipeline(bundler.bundle(), 'vendor.min.js', {uglify: true});

});


gulp.task('app-scripts', function() {
  return scriptPipeline(bundler.bundle(), 'app.min.js', {uglify: true});
});


gulp.task('app-scripts-watched', function() {
  var watcher  = watchify(bundler);


  watcher
    .on('update', function() {
      scriptPipeline(watcher.bundle(), 'app.min.js');
    });

  return scriptPipeline(watcher.bundle(), 'app.min.js');
});


gulp.task('check-deps', function () {
  depcheck(path.resolve('./'), {
    'withoutDev': false,
    'ignoreDirs': ['dist', 'node_modules']
  }, function(U) {
    if(!_.isEmpty(U.dependencies))
      console.error('Unused dependencies: ', U.dependencies.join(', '));

    if(!_.isEmpty(U.devDependencies))
      console.error('Unused dev dependencies: ', U.devDependencies.join(', '));

    if(!_.isEmpty(U.invalidFiles))
      console.error('JS files that couldn\'t be parsed: ', U.invalidFiles.join(', '));
  });
});


gulp.task('styles', function () {
  /**
   * Provide frontend styles as a single bundle.
   */
  return streamqueue(
    {objectMode: true},
    gulp.src(stylesDir + '/app.css'),
    gulp.src(stylesDir + '/custom.css'),
    gulp.src('*/highlight.js/src/styles/default.css')
  )
    .pipe(concat('app.min.css'))
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(gulp.dest(distDir));
});


gulp.task('default', ['vendor-scripts', 'app-scripts', 'styles']);
gulp.task('dev', ['vendor-scripts', 'app-scripts-watched', 'styles']);
