"use strict";

var Storage = require("../lib/storage.js");
var Preferences = require("../lib/pref-utils.js");
var Worker = require("./worker.js");

exports.on = function () {
  Storage.option.command.forEach(function (element, index, array) {
    var name = element[0], type = element[1];
    if (type == "command") {
      Preferences.on(name, Worker[name]);
    }
  });
};
exports.off = function () {
  Storage.option.command.forEach(function (element, index, array) {
    var name = element[0], type = element[1];
    if (type == "command") {
      Preferences.off(name, Worker[name]);
    }
  });
};
