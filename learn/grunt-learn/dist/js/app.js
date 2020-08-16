"use strict";

$(function ($) {
  var $body = $('html body');
  $('#scroll_top').on('click', function () {
    $body.animate({
      scrollTop: 10
    }, 600);
    return false;
  });
});
//# sourceMappingURL=app.js.map
