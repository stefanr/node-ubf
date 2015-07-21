System.register(["./markers", "./base-parser"], function (_export) {
  /*
   * Universal Binary Format
   * Object Pool Extension
   */
  "use strict";

  var MARKER, LEN_OF_MARKER, LEN_OF_SIZE1, LEN_OF_SIZE2, LEN_OF_SIZE4;

  _export("extendContext", extendContext);

  /**
   * Object Pool Extension : extendContext
   */

  _export("parseValue", parseValue);

  /**
   * Object Pool Extension : parseValue
   */

  _export("parseKey", parseKey);

  /**
   * Object Pool Extension : parseKey
   */

  _export("getPoolValue", getPoolValue);

  /**
   * Object Pool Extension : getPoolValue
   */

  _export("setPoolValue", setPoolValue);

  /**
   * Object Pool Extension : setPoolValue
   */

  _export("getPoolKey", getPoolKey);

  /**
   * Object Pool Extension : getPoolKey
   */

  _export("setPoolKey", setPoolKey);

  /**
   * Object Pool Extension : setPoolKey
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

  function parseValue() {
    switch (this.readMarker()) {
      // Get Pool Value --------------------------
      case MARKER.POOL_VAL_GET1:
        {
          var _context;

          var id = this.consumeUInt8(LEN_OF_MARKER);
          if (id === undefined) {
            return;
          }
          return (_context = this.context, getPoolValue).call(_context, id);
        }
      case MARKER.POOL_VAL_GET2:
        {
          var _context2;

          var id = this.consumeUInt16(LEN_OF_MARKER);
          if (id === undefined) {
            return;
          }
          return (_context2 = this.context, getPoolValue).call(_context2, id);
        }

      // Set Pool Value --------------------------
      case MARKER.POOL_VAL_SET1:
        {
          var _context3;

          var id = this.consumeUInt8(LEN_OF_MARKER);
          if (id === undefined) {
            return;
          }
          var value = this.parseValue();
          if (value === undefined) {
            this.rewind(LEN_OF_MARKER + LEN_OF_SIZE1);
            return;
          }
          return (_context3 = this.context, setPoolValue).call(_context3, id, value);
        }
      case MARKER.POOL_VAL_SET2:
        {
          var _context4;

          var id = this.consumeUInt16(LEN_OF_MARKER);
          if (id === undefined) {
            return;
          }
          var value = this.parseValue();
          if (value === undefined) {
            this.rewind(LEN_OF_MARKER + LEN_OF_SIZE2);
            return;
          }
          return (_context4 = this.context, setPoolValue).call(_context4, id, value);
        }
    }
  }

  function parseKey() {
    switch (this.readMarker()) {
      // Get Pool Key ----------------------------
      case MARKER.POOL_KEY_GET1:
        {
          var _context5;

          var id = this.consumeUInt8(LEN_OF_MARKER);
          if (id === undefined) {
            return;
          }
          return (_context5 = this.context, getPoolKey).call(_context5, id);
        }
      case MARKER.POOL_KEY_GET2:
        {
          var _context6;

          var id = this.consumeUInt16(LEN_OF_MARKER);
          if (id === undefined) {
            return;
          }
          return (_context6 = this.context, getPoolKey).call(_context6, id);
        }

      // Set Pool Key ----------------------------
      case MARKER.POOL_KEY_SET1:
        {
          var _context7;

          var id = this.consumeUInt8(LEN_OF_MARKER);
          if (id === undefined) {
            return;
          }
          var key = this.parseKey();
          if (key === undefined) {
            this.rewind(LEN_OF_MARKER + LEN_OF_SIZE1);
            return;
          }
          return (_context7 = this.context, setPoolKey).call(_context7, id, key);
        }
      case MARKER.POOL_KEY_SET2:
        {
          var _context8;

          var id = this.consumeUInt16(LEN_OF_MARKER);
          if (id === undefined) {
            return;
          }
          var key = this.parseKey();
          if (key === undefined) {
            this.rewind(LEN_OF_MARKER + LEN_OF_SIZE2);
            return;
          }
          return (_context8 = this.context, setPoolKey).call(_context8, id, key);
        }
    }
  }

  function getPoolValue(id) {
    return this.pool && this.pool.values.get(id);
  }

  function setPoolValue(id, value) {
    this.pool && this.pool.values.set(id, value);
    return value;
  }

  function getPoolKey(id) {
    // return this.pool && this.pool.keys.get(id);
    return this.pool && this.pool.values.get(id);
  }

  function setPoolKey(id, key) {
    // this.pool && this.pool.keys.set(id, key);
    this.pool && this.pool.values.set(id, key);
    return key;
  }

  return {
    setters: [function (_markers) {
      MARKER = _markers;
    }, function (_baseParser) {
      LEN_OF_MARKER = _baseParser.LEN_OF_MARKER;
      LEN_OF_SIZE1 = _baseParser.LEN_OF_SIZE1;
      LEN_OF_SIZE2 = _baseParser.LEN_OF_SIZE2;
      LEN_OF_SIZE4 = _baseParser.LEN_OF_SIZE4;
    }],
    execute: function () {}
  };
});