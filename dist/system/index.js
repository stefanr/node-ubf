System.register(["./context", "./parser", "./binarifier", "./helpers"], function (_export) {
  /*
   * Universal Binary Format
   */
  "use strict";

  return {
    setters: [function (_context) {
      for (var _key in _context) {
        _export(_key, _context[_key]);
      }
    }, function (_parser) {
      for (var _key2 in _parser) {
        _export(_key2, _parser[_key2]);
      }
    }, function (_binarifier) {
      for (var _key3 in _binarifier) {
        _export(_key3, _binarifier[_key3]);
      }
    }, function (_helpers) {
      for (var _key4 in _helpers) {
        _export(_key4, _helpers[_key4]);
      }
    }],
    execute: function () {}
  };
});