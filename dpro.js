var path = require("path"),
  clc = require("cli-color"),
  _ = require("lodash");

var DPRO_ENV = process.env.DPRO;
var DPRO_INST = process.env.DPRO_INST;
var DPRO_LOCATION = process.env.DPRO_LOCATION || "./conf/data/";

/**
 * Load data from given file(s), normally ${DPRO_LOCATION}/${DPRO_ENV}.js. 
 * If both DPRO_ENV and DPRO_INST are given, and common data exits, 
 * use the one in ${DPRO_LOCATION}/${DPRO_ENV_DPRO_INST}.js
 */

var DPro = function DPro() {
  if (!DPRO_ENV) {
    // data will be provided in test
    console.warn(clc.yellowBright("[WARN]: No data file loaded by data provider"));
    return {};
  }

  // init
  var envData = {};
  var instanceData = {};

  try {
    // load envData
    var penv = path.join(process.cwd(), DPRO_LOCATION, DPRO_ENV);
    envData = require(penv);
    filename = penv;
  } catch (e) {
    // if error happens, return instead of throwing an error out
    console.error(clc.redBright("[ERR]: data file load failed " + e));
    console.error(clc.redBright("[ERR]: no data will be loaded"));
    return {};
  }

  // only load instanceData on cue
  if (DPRO_INST) {
    try {
      // load instanceData
      var pinstance = path.join(process.cwd(), DPRO_LOCATION, DPRO_ENV + "-" + DPRO_INST);
      instanceData = require(pinstance);
      filename = pinstance;
    } catch (e) {
      // if error happens, log it out only
      console.warn(clc.yellowBright("[WARN]: data file (" + DPRO_ENV + "-" + DPRO_INST + ".js) failed in loading " + e));
      console.log(clc.blueBright("[INFO]: use data file " + filename + ".js only"));
    }
  }

  var data = _.assign(envData, instanceData, function (env, inst) {
    // only support first level data merge 
    return _.isUndefined(env) ? inst : env;
  });

  console.log(clc.blueBright("[INFO]: loaded data file " + filename + ".js"));
  return data
};

module.exports = new DPro();
