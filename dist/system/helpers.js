System.register(["./context", "./parser", "./binarifier"], function (_export) {
  /*
   * Universal Binary Format
   * Helpers
   */
  "use strict";

  var Context, Parser, Binarifier;

  _export("parse", parse);

  /**
   * parse
   */

  _export("parseSync", parseSync);

  /**
   * parseSync
   */

  _export("binarify", binarify);

  /**
   * binarify
   */

  _export("binarifySync", binarifySync);

  /**
   * binarifySync
   */

  _export("ubfsize", ubfsize);

  /**
   * ubfsize
   */

  _export("ubfsizeSync", ubfsizeSync);

  /**
   * ubfsizeSync
   */

  function parse(buffer) {
    return new Promise(function (resolve, reject) {
      var p = new Parser(new Context());
      p.on("value", function (e) {
        resolve(e.detail.value);
      });
      p.on("error", function (e) {
        reject(e.detail);
      });
      p.parse(buffer);
    });
  }

  function parseSync(buffer) {
    var p = new Parser(new Context());
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

  function binarify(obj) {
    return new Promise(function (resolve, reject) {
      try {
        var b = new Binarifier(new Context());
        resolve(b.binarify(obj));
      } catch (err) {
        reject(err);
      }
    });
  }

  function binarifySync(obj) {
    try {
      var b = new Binarifier(new Context());
      return b.binarify(obj);
    } catch (err) {
      if (Error.captureStackTrace) {
        Error.captureStackTrace(err, binarifySync);
      }
      throw err;
    }
  }

  function ubfsize(obj) {
    return new Promise(function (resolve, reject) {
      try {
        var b = new Binarifier(new Context());
        var info = b.byteLengthInfo(obj);
        resolve(info.len);
      } catch (err) {
        reject(err);
      }
    });
  }

  function ubfsizeSync(obj) {
    try {
      var b = new Binarifier(new Context());
      var info = b.byteLengthInfo(obj);
      return info.len;
    } catch (err) {
      if (Error.captureStackTrace) {
        Error.captureStackTrace(err, ubfsizeSync);
      }
      throw err;
    }
  }

  return {
    setters: [function (_context) {
      Context = _context.Context;
    }, function (_parser) {
      Parser = _parser.Parser;
    }, function (_binarifier) {
      Binarifier = _binarifier.Binarifier;
    }],
    execute: function () {}
  };
});