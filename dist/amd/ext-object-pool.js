define(["exports", "./markers", "./base-parser"], function (exports, _markers, _baseParser) {
  /*
   * Universal Binary Format
   * Object Pool Extension
   */
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.extendContext = extendContext;
  exports.parseValue = parseValue;
  exports.parseKey = parseKey;
  exports.getPoolValue = getPoolValue;
  exports.setPoolValue = setPoolValue;
  exports.getPoolKey = getPoolKey;
  exports.setPoolKey = setPoolKey;

  /**
   * Object Pool Extension : extendContext
   */

  function extendContext() {
    Object.defineProperty(this, "pool", {
      value: {
        values: new Map(),
        keys: new Map()
      },
      enumerable: true
    });
  }

  /**
   * Object Pool Extension : parseValue
   */

  function parseValue() {
    switch (this.readMarker()) {
      // Get Pool Value --------------------------
      case _markers.POOL_VAL_GET1:
        {
          var _context;

          var id = this.consumeUInt8(_baseParser.LEN_OF_MARKER);
          if (id === undefined) {
            return;
          }
          return (_context = this.context, getPoolValue).call(_context, id);
        }
      case _markers.POOL_VAL_GET2:
        {
          var _context2;

          var id = this.consumeUInt16(_baseParser.LEN_OF_MARKER);
          if (id === undefined) {
            return;
          }
          return (_context2 = this.context, getPoolValue).call(_context2, id);
        }

      // Set Pool Value --------------------------
      case _markers.POOL_VAL_SET1:
        {
          var _context3;

          var id = this.consumeUInt8(_baseParser.LEN_OF_MARKER);
          if (id === undefined) {
            return;
          }
          var value = this.parseValue();
          if (value === undefined) {
            this.rewind(_baseParser.LEN_OF_MARKER + _baseParser.LEN_OF_SIZE1);
            return;
          }
          return (_context3 = this.context, setPoolValue).call(_context3, id, value);
        }
      case _markers.POOL_VAL_SET2:
        {
          var _context4;

          var id = this.consumeUInt16(_baseParser.LEN_OF_MARKER);
          if (id === undefined) {
            return;
          }
          var value = this.parseValue();
          if (value === undefined) {
            this.rewind(_baseParser.LEN_OF_MARKER + _baseParser.LEN_OF_SIZE2);
            return;
          }
          return (_context4 = this.context, setPoolValue).call(_context4, id, value);
        }
    }
  }

  /**
   * Object Pool Extension : parseKey
   */

  function parseKey() {
    switch (this.readMarker()) {
      // Get Pool Key ----------------------------
      case _markers.POOL_KEY_GET1:
        {
          var _context5;

          var id = this.consumeUInt8(_baseParser.LEN_OF_MARKER);
          if (id === undefined) {
            return;
          }
          return (_context5 = this.context, getPoolKey).call(_context5, id);
        }
      case _markers.POOL_KEY_GET2:
        {
          var _context6;

          var id = this.consumeUInt16(_baseParser.LEN_OF_MARKER);
          if (id === undefined) {
            return;
          }
          return (_context6 = this.context, getPoolKey).call(_context6, id);
        }

      // Set Pool Key ----------------------------
      case _markers.POOL_KEY_SET1:
        {
          var _context7;

          var id = this.consumeUInt8(_baseParser.LEN_OF_MARKER);
          if (id === undefined) {
            return;
          }
          var key = this.parseKey();
          if (key === undefined) {
            this.rewind(_baseParser.LEN_OF_MARKER + _baseParser.LEN_OF_SIZE1);
            return;
          }
          return (_context7 = this.context, setPoolKey).call(_context7, id, key);
        }
      case _markers.POOL_KEY_SET2:
        {
          var _context8;

          var id = this.consumeUInt16(_baseParser.LEN_OF_MARKER);
          if (id === undefined) {
            return;
          }
          var key = this.parseKey();
          if (key === undefined) {
            this.rewind(_baseParser.LEN_OF_MARKER + _baseParser.LEN_OF_SIZE2);
            return;
          }
          return (_context8 = this.context, setPoolKey).call(_context8, id, key);
        }
    }
  }

  /**
   * Object Pool Extension : getPoolValue
   */

  function getPoolValue(id) {
    return this.pool && this.pool.values.get(id);
  }

  /**
   * Object Pool Extension : setPoolValue
   */

  function setPoolValue(id, value) {
    this.pool && this.pool.values.set(id, value);
    return value;
  }

  /**
   * Object Pool Extension : getPoolKey
   */

  function getPoolKey(id) {
    // return this.pool && this.pool.keys.get(id);
    return this.pool && this.pool.values.get(id);
  }

  /**
   * Object Pool Extension : setPoolKey
   */

  function setPoolKey(id, key) {
    // this.pool && this.pool.keys.set(id, key);
    this.pool && this.pool.values.set(id, key);
    return key;
  }
});