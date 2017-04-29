"use strict";

var Storage = require("../lib/storage.js");
var Preferences = require("../lib/pref-utils.js");
var Worker = require("./worker.js");
var Locales = require("sdk/l10n").get;
var {Cc, Ci, Cu} = require("chrome");
var {CustomizableUI} = Cu.import("resource:///modules/CustomizableUI.jsm", {});

var Services = { io: Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService), sss: Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService) };
var Toolbar = { icon: false, css: Services.io.newURI(require("sdk/self").data.url("toolbar.css"), null, null) };
var MenuItem = { player: "_options.Player", filter: "_options.Filter", none: "_options.None" };

function createCustomButton(document) {
  var button = document.createElement("toolbarbutton");
  button.setAttribute("id", "sowatchmk2-button");
  button.setAttribute("class", "toolbarbutton-1");
  button.setAttribute("type", "menu");
  button.setAttribute("label", "soWatch! mk2");

  var popup = document.createElement("menupopup");
  popup.setAttribute("id", "sowatchmk2-popup");
  popup.addEventListener("click", menuClick, false);
  popup.addEventListener("popupshowing", menuPopup, false);
  button.appendChild(popup);

  createPopupMenu(document, popup);

  return button;
}

function createPopupMenu(document, popup) {
  var length = Storage.option.menuitem.length - 1;
  Storage.option.menuitem.forEach(function (element, index, array) {
    createTopItem(document, popup, element);

    if (index < length) {
      var separator = document.createElement("menuseparator");
      separator.setAttribute("id", "sowatchmk2-separator-" + index);
      popup.appendChild(separator);
    }
  });

  for (var i in Storage.website) {
    var separator = document.createElement("menuseparator");
    separator.setAttribute("id", "sowatchmk2-separator-" + i);
    popup.appendChild(separator);

    var menu = document.createElement("menu")
    menu.setAttribute("id", "sowatchmk2-" + i);
    menu.setAttribute("label", Locales(i + "_title"));
    menu.setAttribute("class", "menu-iconic");
    popup.appendChild(menu);

    var param = { name: i, player: Storage.website[i].hasPlayer, filter: Storage.website[i].hasFilter };

    createSubItem(document, menu, param);
  }
}

function createTopItem(document, popup, param) {
  param.forEach(function (element, index, array) {
    var name = element[0], type = element[1];
    var item = document.createElement("menuitem");
    item.setAttribute("id", "sowatchmk2-" + name);
    item.setAttribute("class", "menuitem-iconic");
    if (type == "boolean") {
      item.setAttribute("label", Locales(name + "_title"));
      item.setAttribute("type", "checkbox");
    }
    else if (type == "command") {
      item.setAttribute("label", Locales(name + "_label"));
    }
    popup.appendChild(item);
  });
}

function createSubItem(document, menu, param) {
  var popup = document.createElement("menupopup");
  popup.setAttribute("id", "sowatchmk2-" + param.name + "-popup");
  menu.appendChild(popup);

  for (var i in MenuItem) {
    var item = document.createElement("menuitem");
    item.setAttribute("id", "sowatchmk2-" + param.name + "-" + i);
    item.setAttribute("label", Locales(param.name + MenuItem[i]));
    item.setAttribute("type", "radio");
    if (!param.player && i == "player") {
      item.setAttribute("disabled", "true");
    }
    if (!param.filter && i == "filter") {
      item.setAttribute("disabled", "true");
    }
    popup.appendChild(item);
  }
}

function menuClick(event) {
  Storage.option.command.forEach(function (element, index, array) {
    var name = element[0], type = element[1];
    if (event.target.id == "sowatchmk2-" + name) {
      if (type == "command") {
        Worker[name]();
      }
      else if (type == "boolean") {
        if (Storage.option.config[name].value) {
          Preferences.setValue(Storage.option.config[name].prefs, false);
        }
        else {
          Preferences.setValue(Storage.option.config[name].prefs, true);
        }
      }
    }
  });

  for (var i in Storage.website) {
    var website = Storage.website[i];
    if (event.target.id == "sowatchmk2-" + i + "-player") {
      if (!website.hasPlayer) continue;
      Preferences.setValue(website.prefs, 1);
    }
    else if (event.target.id == "sowatchmk2-" + i + "-filter") {
      if (!website.hasFilter) continue;
      Preferences.setValue(website.prefs, 2);
    }
    else if (event.target.id == "sowatchmk2-" + i + "-none") {
      Preferences.setValue(website.prefs, 0);
    }
  }
}

function menuPopup(event) {
  if (event.target.id == "sowatchmk2-popup") {
    Storage.option.command.forEach(function (element, index, array) {
      var name = element[0], type = element[1];
      if (type == "boolean") {
        if (Storage.option.config[name].value) {
          event.target.querySelector("#sowatchmk2-" + name).setAttribute("checked", "true");
        }
        else {
          event.target.querySelector("#sowatchmk2-" + name).setAttribute("checked", "false");
        }
      }
    });

    for (var i in Storage.website) {
      var website = Storage.website[i];
      if (website.value == 1) {
        event.target.querySelector("#sowatchmk2-" + i + "-player").setAttribute("checked", "true");
      }
      else if (website.value == 2) {
        event.target.querySelector("#sowatchmk2-" + i + "-filter").setAttribute("checked", "true");
      }
      else if (website.value == 0) {
        event.target.querySelector("#sowatchmk2-" + i + "-none").setAttribute("checked", "true");
      }
    }
  }
}

exports.on = function () {
  if (Toolbar.icon) return;
  CustomizableUI.createWidget({
    id: "sowatchmk2-button",
    type: "custom",
    defaultArea: CustomizableUI.AREA_NAVBAR,
    onBuild: createCustomButton
  });
  Services.sss.loadAndRegisterSheet(Toolbar.css, Services.sss.AUTHOR_SHEET);
  Toolbar.icon = true;
};
exports.off = function () {
  if (!Toolbar.icon) return;
  Services.sss.unregisterSheet(Toolbar.css, Services.sss.AUTHOR_SHEET);
  CustomizableUI.destroyWidget("sowatchmk2-button");
  Toolbar.icon = false;
};
