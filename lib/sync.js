"use strict";

var FileIO = require("./file-io.js");
var {Cu} = require("chrome");
var {Downloads} = Cu.import("resource://gre/modules/Downloads.jsm", {});

function fetch(link, file, probe) {
  probe = probe || 0;
  if (probe > 3) return;
  probe ++;

  var temp = file + "_sotemp";
  Downloads.fetch(link, temp, {isPrivate: true}).then(
    function onSuccess() {
      FileIO.moveFile(temp, file);
    },
    function onFailure() {
      FileIO.makeFolder(FileIO.folder);
      fetch(link, file, probe);
    }
  );
}

exports.fetch = fetch;
