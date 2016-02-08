"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse = parse;
exports.binarify = binarify;
exports.ubfsize = ubfsize;

var _parser = require("./parser");

var _binarifier = require("./binarifier");

/**
 * Universal Binary Format
 * @module ubf
 */
function parse(buf) {
  return new Promise(function (resolve, reject) {
    var p = new _parser.Parser();
    p.context.on("value", function (e) {
      return resolve(e.value);
    });
    p.context.on("error", function (e) {
      return reject(e);
    });
    p.parse(buf);
  });
}

function binarify(obj) {
  return new Promise(function (resolve, reject) {
    try {
      var b = new _binarifier.Binarifier();
      resolve(b.binarify(obj));
    } catch (err) {
      reject(err);
    }
  });
}

function ubfsize(obj) {
  return new Promise(function (resolve, reject) {
    try {
      var b = new _binarifier.Binarifier();
      var i = b.byteLengthInfo(obj);
      resolve(i.len);
    } catch (err) {
      reject(err);
    }
  });
}