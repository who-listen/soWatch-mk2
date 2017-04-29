"use strict";

var Storage = require("../lib/storage.js");
var FileIO = require("../lib/file-io.js");
var Pattern = require("../lib/makepattern.js");
var Preferences = require("../lib/pref-utils.js");
var Core = require("./core.js");
var Worker = require("./worker.js");
var Toolbar = require("./toolbar.js");

function pendingRules(option, name, prefix) {
  var queue = [], test = {};

  option.forEach(function (element, index, array) {
    var type = element[0], param = prefix + index;

    if (type == "player") {
      var mode = element[1], player = element[2], string = element[3];

      if (mode == 1) {
        var offline, online = offline = player;
      }
      else {
        var path = FileIO.joinPath(Storage.file.folder, player), offline = FileIO.toURI(path), online = Storage.file.server + player;
        queue.push([online, path]);
      }

      Storage.player[param] = {
        website: name,
        offline: offline,
        online: online,
        pattern: Pattern.encode(string)
      };
    }
    else if (type == "filter") {
      var mode = element[1], string = element[2];

      Storage.filter[param] = {
        website: name,
        mode: mode,
        pattern: Pattern.encode(string)
      };
    }
  });

  queue.forEach(function (element, index, array) {
    if(!test[element]) {
      test[element] = 1;
      Storage.file.queue.push(element);
    }
  });
}

function pendingSites() {
  Object.keys(Storage.website).forEach(function (element, index, array) {
    var website = Storage.website[element], param = index * 100;

    website.value = Preferences.getValue(website.prefs);

    pendingRules(website.option, element, param);
  });

  for (var i in Storage.player) {
    var param = Storage.player[i].website, website;
    if (website = Storage.website[param]) {
      website.hasPlayer = true;
      if (website.value == 1) {
        Storage.player[i].enabled = true;
      }
      else {
        Storage.player[i].enabled = false;
      }
    }
  }

  for (var x in Storage.filter) {
    var param = Storage.filter[x].website, website;
    if (website = Storage.website[param]) {
      website.hasFilter = true;
      if (website.value == 2) {
        Storage.filter[x].enabled = true;
      }
      else {
        Storage.filter[x].enabled = false;
      }
    }
  }

  Core.optionWrapper();
}

function pendingOption() {
  for (var i in Storage.option.config) {
    Storage.option.config[i].value = Preferences.getValue(Storage.option.config[i].prefs);
  }

  Storage.file.folder = Storage.option.config["folder"].value || FileIO.folder;
  Storage.file.server = Storage.option.config["server"].value || FileIO.server;
  Storage.file.queue = [];

  pendingSites();
  pendingAddOn();
}

function pendingAddOn() {
  if (Storage.option.config["button"].value) {
    Toolbar.on();
  }
  else {
    Toolbar.off();
  }

  if (Storage.option.config["update"].value < Date.now() / 1000) {
    Worker["download"]();
  }
}

exports.on = function () {
  Core.optionStorage();
  pendingOption();
  Preferences.on("", pendingOption);
};
exports.off = function () {
  Preferences.off("", pendingOption);
};
