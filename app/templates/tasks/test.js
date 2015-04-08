/**
 * Test tasks
 */

var gulp       = require('gulp');
var util       = require('gulp-util');
var chalk      = require('chalk');<% if (filters.e2e) { %>
var protractor = require('gulp-protractor');<% } %><% if (filters.karma) { %>
var karma      = require('karma').server;<% } %><% if (filters.mocha) { %>
var plumber    = require('gulp-plumber');
var mocha      = require('gulp-mocha');<% } %>

/**
 * Log. With options.
 *
 * @param {String} msg
 * @param {Object} options
 */
function log (msg, options) {
  options = options || {};
  console.log(
    (options.padding ? '\n' : '')
    + chalk.yellow(' > ' + msg)
    + (options.padding ? '\n' : '')
  );
}
<% if (filters.e2e) { %>
exports.e2eUpdate = protractor.webdriver_update;

exports.e2eTests = function () {
  gulp.src('client/views/**/*.e2e.js')
    .pipe(protractor.protractor({ configFile: 'protractor.conf.js' }))
    .on('error', function (e) { util.log(e.message); process.exit(-1); })
    .on('end', function () { process.exit(0); });
};
<% } if (filters.karma || filters.mocha) { %>
<% if (filters.mocha) { %>function testServer (done) {

  log('Running server tests...', { padding: true });

  gulp.src('server/**/*.spec.js', { read: false })
    .pipe(plumber())
    .pipe(mocha({ reporter: 'spec' }))
    .once('end', function () {
      done();
    });
}
<% } %><% if (filters.karma) { %>
function testClient (done) {

  log('Running client tests...', { padding: true });

  karma.start({
    configFile: __dirname + '/../karma.conf.js'
  }, function () { done(); });
}
<% } %>
exports.test = function (done) {
  process.env.NODE_ENV = 'test';
  var arg = process.argv[3] ? process.argv[3].substr(2) : false;
  if (arg === 'client') {
    return testClient(done);
  } else if (arg === 'server') {
    return testServer(function () {
      done();
      process.exit();
    });
  } else if (arg === false) {
    return testClient(function () {
      testServer(function () {
        done();
        process.exit();
      });
    });
  } else {
    console.log('Wrong parameter [%s], availables : --client, --server', arg);
  }
};
<% } %>
