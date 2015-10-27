var backbone = require('backbone');
var dialogs = require('./dialog');
var request = require('superagent-bluebird-promise');
var marked = require('marked');
var dialogTemplate = require('./templates/how-it-works-dialog.hbs');

module.exports = dialogs.BaseModalView.extend({
  render: function() {
    this.$el.html(this.template());

    var element = this.$el;
    request.get('/how-it-works.md').then(function(res) {
      var contents = marked(res.text);
      element.find('[data-id="dialog-content"]').html(contents);
    });

    return this;
  },
  template: dialogTemplate
});
