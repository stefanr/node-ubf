define(["exports", "./context", "./parser", "./binarifier"], function (exports, _context, _parser, _binarifier) {
  /*
   * Universal Binary Format
   * Helpers
   */
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.parse = parse;
  exports.parseSync = parseSync;
  exports.binarify = binarify;
  exports.binarifySync = binarifySync;
  exports.ubfsize = ubfsize;
  exports.ubfsizeSync = ubfsizeSync;

  /**
   * parse
   */

  function parse(buffer) {
    return new Promise(function (resolve, reject) {
      var p = new _parser.Parser(new _context.Context());
      p.on("value", function (e) {
        resolve(e.detail.value);
      });
      p.on("error", function (e) {
        reject(e.detail);
      });
      p.parse(buffer);
    });
  }

  /**
   * parseSync
   */

  function parseSync(buffer) {
    var p = new _parser.Parser(new _context.Context());
    var value = undefined;
    p.on("value", function (e) {
      value = e.detail.value;
      p.stop();
    });
    p.on("error", function (e) {
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
    return new Promise(function (resolve, reject) {
      try {
        var b = new _binarifier.Binarifier(new _context.Context());
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
      var b = new _binarifier.Binarifier(new _context.Context());
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
    return new Promise(function (resolve, reject) {
      try {
        var b = new _binarifier.Binarifier(new _context.Context());
        var info = b.byteLengthInfo(obj);
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
      var b = new _binarifier.Binarifier(new _context.Context());
      var info = b.byteLengthInfo(obj);
      return info.len;
    } catch (err) {
      if (Error.captureStackTrace) {
        Error.captureStackTrace(err, ubfsizeSync);
      }
      throw err;
    }
  }
});