"use strict";

var {Cu} = require("chrome");
var {OS} = Cu.import("resource://gre/modules/osfile.jsm", {});

exports.folder = OS.Path.join(OS.Constants.Path.profileDir, "soWatch");
exports.server = "https://bitbucket.org/kafan15536900/haoutil/raw/master/player/testmod/";
exports.joinPath = function (base, addon) {
  return OS.Path.join(base, addon);
};
exports.toURI = function (path) {
  return OS.Path.toFileURI(path);
};
exports.toPath = function (uri) {
  return OS.Path.fromFileURI(uri);
};
exports.moveFile = function (object, target) {
  OS.File.move(object, target);
};
exports.makeFolder = function (folder) {
  OS.File.makeDir(folder);
};
exports.removeFolder = function (folder) {
  OS.File.removeDir(folder);
};
