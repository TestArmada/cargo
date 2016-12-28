"use strict";

import argvs from "yargs";
import util from "util";
import clc from "cli-color";

const debug = argvs.argv.debug;

export default {
  output: console,

  debug(...msgs) {
    if (debug) {
      var deb = clc.blueBright("[DEBUG]");
      this.output.log(util.format("[%s] %s %s", "DPRO", deb, msgs.join("|")));
    }
  },
  log(...msgs) {
    var info = clc.greenBright("[INFO]");
    this.output.log(util.format("[%s] %s %s", "DPRO", info, msgs.join("|")));
  },
  warn(...msgs) {
    var warn = clc.yellowBright("[WARN]");
    this.output.warn(util.format("[%s] %s %s", "DPRO", warn, msgs.join("|")));
  },
  err(...msgs) {
    var err = clc.redBright("[ERROR]");
    this.output.error(util.format("[%s] %s %s", "DPRO", err, msgs.join("|")));
  }
};