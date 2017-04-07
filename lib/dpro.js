import path from "path";
import _ from "lodash";
import logger from "testarmada-logger";
import safeJsonStringify from "safe-json-stringify";

const DPRO_ENV = process.env.DPRO || "default.js";
const DPRO_INST = process.env.DPRO_INST;
const DPRO_LOCATION = process.env.DPRO_LOCATION;

const appendPrefix = (str) => {
  if (!_.endsWith(str, ".js") && !_.endsWith(str, ".json")) {
    return `${str}.js`;
  }
  return str;
};

logger.prefix = "Dpro";

/**
 * Load data from given file(s), normally ${dproLocationParam}/${dproEnvParam}.js.
 * If both dproEnvParam and dproInstParam are given, and common data exits,
 * use the one in ${dproLocationParam}/${dproEnvParam_dproInstParam}.js
 */

module.exports = function provideData({ dproEnv = null, dproInst = null, dproLocation = null },
  nocache = false /* should'nt have a real use case with noncache = true*/) {
  const dproEnvParam = dproEnv || DPRO_ENV;
  const dproInstParam = dproInst || DPRO_INST;
  const dproLocationParam = dproLocation || DPRO_LOCATION || "./conf/data/";

  if (!dproEnvParam) {
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

    const penv = path.join(process.cwd(), dproLocationParam, dproEnvParam);
    if (nocache) {
      delete require.cache[appendPrefix(penv)];
    }
    /*eslint-disable global-require*/
    envData = require(penv);
    filename = appendPrefix(penv);
  } catch (e) {
    // if error happens, return instead of throwing an error out
    logger.err(`Failed in loading data: ${e.toString()}`);
    return {};
  }

  // only load instanceData on demand
  if (dproInstParam) {
    try {
      // load instanceData
      const pinstance = path.join(process.cwd(),
        dproLocationParam,
        `${dproEnvParam}-${dproInstParam}`);

      if (nocache) {
        delete require.cache[appendPrefix(pinstance)];
      }
      /*eslint-disable global-require*/
      instanceData = require(pinstance);
      filename = appendPrefix(pinstance);
    } catch (e) {
      // if error happens, log it out only
      logger.err(`Failed in loading data file `
        + `${appendPrefix(`${dproEnvParam}-${dproInstParam}`)}: ${e.toString()}`);
      logger.warn(`Use data file ${filename} only`);
    }
  }

  const data = _.assign(envData, instanceData);

  logger.log(`Loaded data file ${filename}`);
  logger.debug(`Loaded data content: ${safeJsonStringify(data)}`);

  return data;
};
