"use strict";

exports.option = [
  ["report", null, "command", null, 0],
  ["restore", null, "command", null, 1],
  ["button", true, "boolean", true, null],
  ["update", 0, "integer", false, null],
  ["interval", 8, "integer", true, null],
  ["download", null, "command", null, 2],
  ["offline", true, "boolean", true, 2],
  ["server", "", "string", false, null],
  ["folder", "", "string", false, null]
];
exports.website = [
  [
    "youku",
    0,
    "youku.com",
    [
      ["player", 0, "loader.swf", /https?:\/\/static\.youku\.com\/[^\/]+\/v\/swf\/.*loader.*\.swf/i],
      ["player", 0, "player.swf", /https?:\/\/static\.youku\.com\/[^\/]+\/v\/swf\/.*player.*\.swf/i],
      ["filter", 1, /https?:\/\/val.+\.atm\.youku\.com\/v.+/i]
    ]
  ],
  [
    "tudou",
    0,
    "tudou.com",
    [
      ["player", 0, "tudou.swf", /https?:\/\/static\.youku\.com\/[^\/]+\/v\/custom\/.*player.*\.swf/i],
      ["filter", 0, /https?:\/\/val.+\.atm\.youku\.com\/v.+/i]
    ]
  ],
  [
    "iqiyi",
    0,
    "iqiyi.com",
    [
      ["player", 0, "iqiyi5.swf", /https?:\/\/www\.iqiyi\.com\/common\/flashplayer\/[^\/]+\/((Main)?Player_.+|\w+c2359)\.swf/i],
      ["player", 0, "iqiyi_out.swf", /https?:\/\/www\.iqiyi\.com\/common\/flashplayer\/[^\/]+\/EnjoyPlayer.+\.swf/],
      ["filter", 0, /https?:\/\/([^\.\/]+\.){3}[^\.\/]+\/videos\/other\/([^\/]+\/){3}.+\.(f4v|hml)/i]
    ]
  ],
  [
    "letv",
    0,
    "le.com",
    [
      ["player", 0, "letvsdk.swf", /https?:\/\/player\.letvcdn\.com\/.*\/newplayer\/LetvPlayerSDK\.swf/i],
      ["filter", 0, /https?:\/\/(\d+\.){3}(\d+\/){4}letv-gug\/[^\/]+\/ver_.+avc.+aac.+\.mp4/i],
      ["filter", 0, /https?:\/\/i.+\.letvimg\.com\/lc.+_(gugwl|diany)(\/[^\/]+){4}/i],
    ]
  ],
  [
    "sohu",
    0,
    "sohu.com",
    [
      ["player", 0, "sohu_live.swf", /https?:\/\/tv\.sohu\.com\/upload\/swf\/[^\/]+\/Main\.swf/i],
      ["filter", 1, /https?:\/\/(\d+\.){3}\d+\/sohu\.vodnew\.lxdns\.com\/sohu\/([^\/]+\/){3}.+\.mp4.+&prod=ad/i],
      ["filter", 1, /https?:\/\/images\.sohu.com\/ytv\/BJ\/BJSC\/\d+\.swf/i],
      ["filter", 1, /https?:\/\/newflv\.sohu\.ccgslb\.net\/(\d+\/){2}.+\.mp4.+&prod=ad/i]
    ]
  ],
  [
    "pptv",
    0,
    "pptv.com",
    [
      ["player", 0, "player4player2.swf", /https?:\/\/player\.pplive\.cn\/ikan\/[^\/]+\/player4player2\.swf/i],
      ["filter", 0, /https?:\/\/de\.as\.pptv\.com\/ikandelivery\/vast\/.+draft\/.+/i]
    ]
  ]
];
exports.wrapper = [
  ["filter", "youku", ["tudou"]]
];
