/*
 * Universal Binary Format
 * Helpers
 */
"use strict";

export { parse };
export { parseSync };
export { binarify };
export { binarifySync };
export { ubfsize };
export { ubfsizeSync };
import { Context } from "./context";
import { Parser } from "./parser";
import { Binarifier } from "./binarifier";

/**
 * parse
 */

function parse(buffer) {
  return new Promise((resolve, reject) => {
    let p = new Parser(new Context());
    p.on("value", e => {
      resolve(e.detail.value);
    });
    p.on("error", e => {
      reject(e.detail);
    });
    p.parse(buffer);
  });
}

/**
 * parseSync
 */

function parseSync(buffer) {
  let p = new Parser(new Context());
  let value;
  p.on("value", e => {
    value = e.detail.value;
    p.stop();
  });
  p.on("error", e => {
    if (Error.captureStackTrace) {
      Error.captureStackTrace(e.detail, parseSync);
    }
    throw e.detail;
  });
  p.parse(buffer);
  return value;
}

/**
 * binarify
 */

function binarify(obj) {
  return new Promise((resolve, reject) => {
    try {
      let b = new Binarifier(new Context());
      resolve(b.binarify(obj));
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * binarifySync
 */

function binarifySync(obj) {
  try {
    let b = new Binarifier(new Context());
    return b.binarify(obj);
  } catch (err) {
    if (Error.captureStackTrace) {
      Error.captureStackTrace(err, binarifySync);
    }
    throw err;
  }
}

/**
 * ubfsize
 */

function ubfsize(obj) {
  return new Promise((resolve, reject) => {
    try {
      let b = new Binarifier(new Context());
      let info = b.byteLengthInfo(obj);
      resolve(info.len);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * ubfsizeSync
 */

function ubfsizeSync(obj) {
  try {
    let b = new Binarifier(new Context());
    let info = b.byteLengthInfo(obj);
    return info.len;
  } catch (err) {
    if (Error.captureStackTrace) {
      Error.captureStackTrace(err, ubfsizeSync);
    }
    throw err;
  }
}