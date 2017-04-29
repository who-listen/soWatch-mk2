"use strict";

var Events = require("./data/events.js");
var Configuration = require("./data/config.js");
var HttpRequest = require("./data/httprequest.js");
var Toolbar = require("./data/toolbar.js");
var Hotfix = require("./misc/hotfix.js");
var History = require("./misc/history.js");

exports.main = function (options, callbacks) {
  Events.on();
  HttpRequest.on();
  Configuration.on();
  Toolbar.on();
  Hotfix.patch();
  History.show(options.loadReason);
};

exports.onUnload = function (reason) {
  Events.off();
  HttpRequest.off();
  Configuration.off();
  Toolbar.off();
};
