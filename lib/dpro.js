"use strict";

import path from "path";
import clc from "cli-color";
import _ from "lodash";

import logger from "./logger";

const DPRO_ENV = process.env.DPRO || "default.js";
const DPRO_INST = process.env.DPRO_INST;
const DPRO_LOCATION = process.env.DPRO_LOCATION;

let appendPrefix = function (str) {
  if (!_.endsWith(str, ".js") && !_.endsWith(str, ".json")) {
    return str + ".js";
  }
  return str;
}

/**
 * Load data from given file(s), normally ${dpro_location_p}/${dpro_env_p}.js. 
 * If both dpro_env_p and dpro_inst_p are given, and common data exits, 
 * use the one in ${dpro_location_p}/${dpro_env_p_dpro_inst_p}.js
 */

module.exports = function provideData({dpro_env = null, dpro_inst = null, dpro_location = null},
  nocache = false /* should'nt have a real use case with noncache = true*/) {
  let dpro_env_p = dpro_env || DPRO_ENV;
  let dpro_inst_p = dpro_inst || DPRO_INST;
  let dpro_location_p = dpro_location || DPRO_LOCATION || "./conf/data/";

  if (!dpro_env_p) {
    // no data is loaded, return an empty data set
    logger.warn("No data file is loaded");
    return {};
  }

  // init
  let envData = {};
  let instanceData = {};
  let filename = null;

  try {
    // load envData

    let penv = path.join(process.cwd(), dpro_location_p, dpro_env_p);
    if (nocache) {
      delete require.cache[appendPrefix(penv)];
    }
    envData = require(penv);
    filename = appendPrefix(penv);
  } catch (e) {
    // if error happens, return instead of throwing an error out
    logger.err("Failed in loading data: " + e.toString());
    return {};
  }

  // only load instanceData on demand
  if (dpro_inst_p) {
    try {
      // load instanceData
      var pinstance = path.join(process.cwd(), dpro_location_p, dpro_env_p + "-" + dpro_inst_p);
      if (nocache) {
        delete require.cache[appendPrefix(pinstance)];
      }

      instanceData = require(pinstance);
      filename = appendPrefix(pinstance);
    } catch (e) {
      // if error happens, log it out only
      logger.warn("Failed in loading data file " + appendPrefix(dpro_env_p + "-" + dpro_inst_p) + ": " + e.toString());
      logger.log("Use data file " + filename + " only");
    }
  }

  let data = _.assign(envData, instanceData, (env, inst) => {
    return _.isUndefined(env) ? inst : env;
  });

  logger.log("Loaded data file " + filename);
  return data;
};