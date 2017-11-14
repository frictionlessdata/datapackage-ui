export default {
  home: (client) => {
    client
      .url(client.launch_url)
      .waitForElementVisible('#form', 10000)
      // .click('#validate')
      // .waitForElementVisible('.datapackage-ui-report', 10000)
      // .assert.containsText('a.file-name', 'data/invalid.csv')
      .end();
  },
  afterEach: (client, done) => {
     client.globals.report(client, done);
  },
};
