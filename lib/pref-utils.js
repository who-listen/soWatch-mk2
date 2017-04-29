"use strict";

var SimplePrefs = require("sdk/simple-prefs");

exports.getValue = function (branch) {
  return SimplePrefs.prefs[branch.name];
};
exports.setValue = function (branch, value) {
  SimplePrefs.prefs[branch.name] = value;
};
exports.resetValue = function (branch) {
  SimplePrefs.prefs[branch.name] = branch.value;
};
exports.on = function (name, callback) {
  SimplePrefs.on(name, callback);
};
exports.off = function (name, callback) {
  SimplePrefs.off(name, callback);
};
