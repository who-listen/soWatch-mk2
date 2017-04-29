"use strict";

var self = require("sdk/self");
var panel = require("sdk/panel");
var repository = "https://github.com/jc3213/soWatch-mk2/releases/";
var name = self.name, version = self.version;

exports.show = function (reason) {
  if (["install", "upgrade"].indexOf(reason) > -1) {
    var history = panel.Panel({
      contentURL: repository + version,
      contentScript: ""
      + "var history=document.createElement('body');"
      + "[...document.getElementsByClassName('markdown-body')].map(e=>history.appendChild(e));"
      + "document.body=history;",
      position: {
        right: 12,
        bottom: 12,
      },
      width: 418,
      height: 148
    });
    history.show();
  }
};
