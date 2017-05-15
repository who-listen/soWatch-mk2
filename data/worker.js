"use strict";

var Storage = require("../lib/storage.js");
var Preferences = require("../lib/pref-utils.js");
var Synchronize = require("../lib/sync.js");

exports.restore = function () {
  for (var i in Storage.option.config) {
    if (Storage.option.config[i].reset) {
      Preferences.resetValue(Storage.option.config[i].prefs);
    }
  }

  for (var x in Storage.website) {
    Preferences.resetValue(Storage.website[x].prefs);
  }
};
exports.download = function (state) {
  Preferences.setValue(Storage.option.config["update"].prefs, parseInt(Date.now() / 1000) + Storage.option.config["interval"].value * 86400);

  Storage.file.queue.forEach(function (element, index, array) {
    var link = element[0], file = element[1];
    Synchronize.fetch(link, file);
  });
};
exports.report = function () {
  var self = require("sdk/self");
  var tabs = require("sdk/tabs");
  var issue = "https://github.com/jc3213/Misc/issues/new?title=" + self.name + "+" + self.version + "+" + tabs.activeTab.url;
  tabs.open(issue);
};
