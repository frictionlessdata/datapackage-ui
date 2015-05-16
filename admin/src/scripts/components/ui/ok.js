var $ = require('jquery');

function ok() {

  // disable ribbon clickthrough
  if ($(document).width() > 767) {

    $('.navbar .open-knowledge').click(function(e) {
      e.preventDefault();

      // The collapse wasn't working, so I added this for now.
      alert('this link is not working');

    });

  }

  // default class
  $('.navbar .open-knowledge').addClass('collapsed');

}


module.exports = ok;
