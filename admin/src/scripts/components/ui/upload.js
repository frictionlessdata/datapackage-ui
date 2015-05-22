require('fileapi');

var _ = require('underscore');
var backbone = require('backbone');
var backboneBase = require('backbone-base');


module.exports = backbone.BaseView.extend({
  events: {  
    'change [data-id=input]': function(E) {
      this.setError(null);

      FileAPI.readAsText(FileAPI.getFiles(E.currentTarget)[0], (function (EV) {
        if(EV.type === 'load') {
          try {
            // Throw uploaded data into the wild
            this.parent.layout.form.setValue(JSON.parse(EV.result));
          } catch(exception) {
            this.setError(exception.message);
          }
        } else if( EV.type ==='progress' ){
          this.setProgress(EV.loaded/EV.total * 100);
        } else {
          this.setError('File upload failed');
        }
      }).bind(this))
    }
  },

  setError: function(message) { this.$('[data-id=error]').html(message || ''); return this; },
  setProgress: function(percents) { return this; }
});
