const spawn = require('child_process').spawn;

// TODO: enable after Saucelabs account setup
console.warn('E2E tests are disabled for now in "rune2e.js"!')
process.exit()

// Main

const env = (process.env.TRAVIS) ? 'chrome,safari,edge' : 'chrome'
const server = spawn('./node_modules/.bin/http-server', ['-p', '9090']);
const runner = spawn('./node_modules/.bin/nightwatch', ['-e', env], {stdio: 'inherit'});

runner.on('exit', function (code) {
  server.kill();
  process.exit(code);
});

runner.on('error', function (err) {
  server.kill();
  throw err;
});
