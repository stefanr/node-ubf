"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.POOL_UNDEFINED = undefined;
exports.parseValue = parseValue;
exports.parseKey = parseKey;

var _markers = require("./markers");

var MARKER = _interopRequireWildcard(_markers);

var _modBase = require("./mod-base");

var base = _interopRequireWildcard(_modBase);

var _modChunks = require("./mod-chunks");

var chunks = _interopRequireWildcard(_modChunks);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var POOL_UNDEFINED = exports.POOL_UNDEFINED = Symbol("{undefined}");

/**
 * Value
 */
/**
 * Universal Binary Format
 * @module ubf
 */
function parseValue() {
  switch (this.readMarker()) {
    // Value : Get
    case MARKER.VAL_POOL_GET1:
      {
        var _context;

        var id = this.consumeUInt8(base.LEN_OF_MARKER);
        if (id === undefined) {
          return;
        }
        return (_context = this.context, getPoolValue).call(_context, id);
      }
    case MARKER.VAL_POOL_GET2:
      {
        var _context2;

        var id = this.consumeUInt16(base.LEN_OF_MARKER);
        if (id === undefined) {
          return;
        }
        return (_context2 = this.context, getPoolValue).call(_context2, id);
      }

    // Value : Set
    case MARKER.VAL_POOL_SET1:
      {
        var _context3;

        var id = this.consumeUInt8(base.LEN_OF_MARKER);
        if (id === undefined) {
          return;
        }
        var value = this.parseValue();
        if (value === undefined) {
          this.rewind(base.LEN_OF_MARKER + base.LEN_OF_SIZE1);
          return;
        } else if (value instanceof chunks.Chunk) {
          return handleChunk.call(this, id, value);
        }
        return (_context3 = this.context, setPoolValue).call(_context3, id, value);
      }
    case MARKER.VAL_POOL_SET2:
      {
        var _context4;

        var id = this.consumeUInt16(base.LEN_OF_MARKER);
        if (id === undefined) {
          return;
        }
        var value = this.parseValue();
        if (value === undefined) {
          this.rewind(base.LEN_OF_MARKER + base.LEN_OF_SIZE2);
          return;
        } else if (value instanceof chunks.Chunk) {
          return handleChunk.call(this, id, value);
        }
        return (_context4 = this.context, setPoolValue).call(_context4, id, value);
      }
  }
}

function handleChunk(id, chunk) {
  var _context5,
      _this = this;

  (_context5 = this.context, setPoolValue).call(_context5, id, POOL_UNDEFINED);
  chunk.on("end", function (_ref) {
    var _context6;

    var value = _ref.value;

    (_context6 = _this.context, setPoolValue).call(_context6, id, value);
  });
  return chunk;
}

/**
 * Key
 */
function parseKey() {
  switch (this.readMarker()) {
    // Pool : Get
    case MARKER.KEY_POOL_GET1:
      {
        var _context7;

        var id = this.consumeUInt8(base.LEN_OF_MARKER);
        if (id === undefined) {
          return;
        }
        return (_context7 = this.context, getPoolKey).call(_context7, id);
      }
    case MARKER.KEY_POOL_GET2:
      {
        var _context8;

        var id = this.consumeUInt16(base.LEN_OF_MARKER);
        if (id === undefined) {
          return;
        }
        return (_context8 = this.context, getPoolKey).call(_context8, id);
      }

    // Key : Set
    case MARKER.KEY_POOL_SET1:
      {
        var _context9;

        var id = this.consumeUInt8(base.LEN_OF_MARKER);
        if (id === undefined) {
          return;
        }
        var key = this.parseKey();
        if (key === undefined) {
          this.rewind(base.LEN_OF_MARKER + base.LEN_OF_SIZE1);
          return;
        }
        return (_context9 = this.context, setPoolKey).call(_context9, id, key);
      }
    case MARKER.KEY_POOL_SET2:
      {
        var _context10;

        var id = this.consumeUInt16(base.LEN_OF_MARKER);
        if (id === undefined) {
          return;
        }
        var key = this.parseKey();
        if (key === undefined) {
          this.rewind(base.LEN_OF_MARKER + base.LEN_OF_SIZE2);
          return;
        }
        return (_context10 = this.context, setPoolKey).call(_context10, id, key);
      }
  }
}

function getPoolValue(id) {
  return this.valPool.get(id);
}

function setPoolValue(id, value) {
  this.valPool.set(id, value);
  return value;
}

function getPoolKey(id) {
  return this.keyPool.get(id);
}

function setPoolKey(id, key) {
  this.keyPool.set(id, key);
  return key;
}