"use strict";

var PageMod = require("sdk/page-mod");

function youku() {
  PageMod.PageMod({
    include: "*.youku.com",
    contentStyle: ""
    + ".danmuoff .vpactionv5_iframe_wrap {"
    +   "top: auto !important;"
    + "}"
    + ""
    + ".play_area{"
    +   "margin-bottom: 70px !important;"
    + "}"
  });
}

exports.patch = function () {
  youku();
};
