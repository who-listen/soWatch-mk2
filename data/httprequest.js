"use strict";

var Storage = require("../lib/storage.js");
var events = require("sdk/system/events");
var {Cc, Ci, Cr, Cu} = require("chrome");
var {NetUtil} = Cu.import("resource://gre/modules/NetUtil.jsm", {});

var request = {};

function setFilter(rule, httpChannel) {
  if (rule["mode"] == 1) {
    httpChannel.suspend();
  }
  else {
    httpChannel.cancel(Cr.NS_BINDING_ABORTED);
  }
}

function setPlayer(object, rule, httpChannel) {
  httpChannel.suspend();
  NetUtil.asyncFetch(object, function (inputStream, status) {
    var binaryOutputStream = Cc["@mozilla.org/binaryoutputstream;1"].createInstance(Ci.nsIBinaryOutputStream);
    var storageStream = Cc["@mozilla.org/storagestream;1"].createInstance(Ci.nsIStorageStream);
    var count = inputStream.available();
    var data = NetUtil.readInputStreamToString(inputStream, count);
    storageStream.init(512, count, null);
    binaryOutputStream.setOutputStream(storageStream.getOutputStream(0));
    binaryOutputStream.writeBytes(data, count);
    rule["storageStream"] = storageStream;
    rule["count"] = count;
    httpChannel.resume();
  });
}

function getFilter(httpChannel) {
  for (var i in Storage.filter) {
    var rule = Storage.filter[i];

    if (!rule.enabled) continue;

    if (rule.pattern.test(httpChannel.URI.spec)) {
      if (rule.website == "iqiyi") {
        request[rule.website] ++;
        if (request[rule.website] != 2) {
          setFilter(rule, httpChannel);
        }
      }
      else {
        setFilter(rule, httpChannel);
      }
    }
  }
}

function getPlayer(subject, httpChannel) {
  var offline = Storage.option.config["offline"].value;

  for (var i in Storage.player) {
    var rule = Storage.player[i], site = Storage.website[rule.website];

    if (/\.swf$/i.test(httpChannel.URI.spec)) {
      request[rule.website] = 0;
    }

    if (!rule.enabled) continue;

    if (rule.pattern.test(httpChannel.URI.spec)) {
      if (!rule["storageStream"] || !rule["count"]) {
        if (offline) {
          setPlayer(rule.offline, rule, httpChannel);
        }
        else {
          setPlayer(rule.online, rule, httpChannel);
        }
      }
      var newListener = new TrackingListener();
      subject.QueryInterface(Ci.nsITraceableChannel);
      newListener.originalListener = subject.setNewListener(newListener);
      newListener.rule = rule;
      break;
    }
  }
}

function TrackingListener() {
  this.originalListener = null;
  this.rule = null;
}
TrackingListener.prototype = {
  onStartRequest: function (request, context) {
    this.originalListener.onStartRequest(request, context);
  },
  onStopRequest: function (request, context) {
    this.originalListener.onStopRequest(request, context, Cr.NS_OK);
  },
  onDataAvailable: function (request, context) {
    this.originalListener.onDataAvailable(request, context, this.rule["storageStream"].newInputStream(0), 0, this.rule["count"]);
  }
}

function httpRequest(event) {
  var httpChannel = event.subject.QueryInterface(Ci.nsIHttpChannel);
  getFilter(httpChannel);
  getPlayer(event.subject, httpChannel);
}

exports.on = function () {
  events.on("http-on-examine-response", httpRequest, false);
};
exports.off = function () {
  events.off("http-on-examine-response", httpRequest);
};
