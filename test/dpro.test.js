"use strict";

import chai from "chai";
import _ from "lodash";
import path from "path";

import provideData from "../dpro";

const expect = chai.expect;
const assert = chai.assert;

describe("DPRO", () => {
  let config = {};

  beforeEach(() => {
    config = {
      dproEnv: null,
      dproInst: null,
      dproLocation: "./dist/test/data"
    };
  });

  it("Use default DPRO_ENV", () => {
    let dpro = provideData(config, true);
    expect(dpro.temconfigstr).to.equal("default");
    expect(dpro.temconfigint).to.equal(1);
    expect(dpro.temconfigbool).to.equal(false);
  });

  it("Pass default DPRO_ENV explicitly", () => {
    config.dproEnv = "default";
    let dpro = provideData(config, true);
    expect(dpro.temconfigstr).to.equal("default");
    expect(dpro.temconfigint).to.equal(1);
    expect(dpro.temconfigbool).to.equal(false);
  });

  it("Change DPRO_ENV", () => {
    config.dproEnv = "d.js";
    let dpro = provideData(config, true);
    expect(dpro.temconfigstr).to.equal("notdefault");
    expect(dpro.temconfigint).to.equal(1);
    expect(dpro.temconfigbool).to.equal(false);
  });

  it("Return empty object if DPRO_LOCATION isn't correct", () => {
    config.dproLocation = "./doesntexist";
    let dpro = provideData(config, true);
    expect(dpro).to.eql({});
  });

  it("Use instance DPRO_INST", () => {
    config.dproEnv = "d";
    config.dproInst = "qa1";
    let dpro = provideData(config, true);
    expect(dpro.temconfigstr).to.equal("notdefault");
    expect(dpro.temconfigint).to.equal(2);
    expect(dpro.temconfigbool).to.equal(false);
    expect(dpro.addon).to.equal(false);
  });

  it("Read DPRO_ENV only if DPRO_INST isn't correct", () => {
    config.dproEnv = "d";
    config.dproInst = "nonexist";
    let dpro = provideData(config, true);

    expect(dpro.temconfigstr).to.equal("notdefault");
    expect(dpro.temconfigint).to.equal(1);
    expect(dpro.temconfigbool).to.equal(false);
  });
});