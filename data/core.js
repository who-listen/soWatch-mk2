"use strict";

var Storage = require("../lib/storage.js");
var Rulelist = require("../lib/rulelist.js");
var Preferences = require("../lib/pref-utils.js");

exports.optionStorage = function () {
  Storage.option.config = {}, Storage.option.command = [], Storage.option.menuitem = [];

  Rulelist.option.forEach(function (element, index, array) {
    var name = element[0], value = element[1], type = element[2], reset = element[3], order = element[4];
    if (type != "command") {
      Storage.option.config[name] = {
        prefs: {name: name, type: type, value: value},
        reset: reset
      };
    }

    if (typeof order == "number") {
      if (type == "command" || type == "boolean") {
        Storage.option.command.push([name, type]);
        if (!Storage.option.menuitem[order]) {
          Storage.option.menuitem[order] = [];
        }
        Storage.option.menuitem[order].push([name, type]);
      }
    }
  });

  Rulelist.website.forEach(function (element, index, array) {
    var name = element[0], value = element[1], address = element[2], option = element[3];
    Storage.website[name] = {
      prefs: {name: name, type: "integer", value: value},
      host: address,
      option: option
    };
  });
};
exports.optionWrapper = function () {
  Rulelist.wrapper.forEach(function (element, index, array) {
    var entry = element[0], major = element[1], minor = element[2];
    minor.forEach(function (element, index, array) {
      major = Storage.website[major], minor = Storage.website[element];
      if (entry == "player") {
        if ((major.value == 1 && minor.value != 1) || (major.value != 0 && minor.value == 1)) {
          Preferences.setValue(minor.prefs, major.value);
        }
      }
      if (entry == "filter") {
        if ((major.value == 2 && minor.value == 0) || (major.value == 0 && minor.value == 2)) {
          Preferences.setValue(minor.prefs, major.value);
        }
      }
    });
  });
};
