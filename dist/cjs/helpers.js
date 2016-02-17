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
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return new Promise(function (resolve, reject) {
    var p = new _parser.Parser(null, options);
    p.context.on("value", function (_ref) {
      var value = _ref.value;
      return resolve(value);
    });
    p.context.on("error", function (err) {
      return reject(err);
    });
    p.parse(buf);
  });
}

function binarify(obj) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return new Promise(function (resolve, reject) {
    try {
      var b = new _binarifier.Binarifier(null, options);
      resolve(b.binarify(obj));
    } catch (err) {
      reject(err);
    }
  });
}

function ubfsize(obj) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return new Promise(function (resolve, reject) {
    try {
      var b = new _binarifier.Binarifier(null, options);

      var _b$byteLengthInfo = b.byteLengthInfo(obj);

      var len = _b$byteLengthInfo.len;

      resolve(len);
    } catch (err) {
      reject(err);
    }
  });
}