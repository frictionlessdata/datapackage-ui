require('fileapi');

var _ = require('underscore');
var backbone = require('backbone');
var backboneBase = require('backbone-base');


module.exports = backbone.BaseView.extend({
  events: {  
    'change': function(E) {
      FileAPI.readAsText(FileAPI.getFiles(E.currentTarget)[0], (function (EV) {
        if(EV.type === 'load') {
          // Throw uploaded data into the wild
          this.trigger('upload', JSON.parse(EV.result));
        } else if( EV.type ==='progress' ){
          this.setProgress(EV.loaded/EV.total * 100);
        } else {
          // WARN Throw error
        }
      }).bind(this))
    }
  },

  setProgress: function(percents) { return this; }
});
