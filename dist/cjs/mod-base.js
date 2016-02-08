"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LEN_OF_SIZE4 = exports.LEN_OF_SIZE2 = exports.LEN_OF_SIZE1 = exports.LEN_OF_MARKER = undefined;
exports.parseControlDirective = parseControlDirective;
exports.parseValue = parseValue;
exports.parseKey = parseKey;
exports.parseLength = parseLength;
exports.parseValueDict = parseValueDict;
exports.parseValueList = parseValueList;

var _markers = require("./markers");

var MARKER = _interopRequireWildcard(_markers);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var LEN_OF_MARKER = exports.LEN_OF_MARKER = 1; /**
                                                * Universal Binary Format
                                                * @module ubf
                                                */

var LEN_OF_SIZE1 = exports.LEN_OF_SIZE1 = 1;
var LEN_OF_SIZE2 = exports.LEN_OF_SIZE2 = 2;
var LEN_OF_SIZE4 = exports.LEN_OF_SIZE4 = 4;

/**
 * ControlDirective
 */
function parseControlDirective() {
  switch (this.readMarker()) {
    case MARKER.CTRL_HEADER:
      {
        this.consume(LEN_OF_MARKER);
        // TODO
        return true;
      }
  }
}

/**
 * Value
 */
function parseValue() {
  switch (this.readMarker()) {
    // Dict
    case MARKER.VAL_DICT1:
      {
        var length = parseLength.call(this, LEN_OF_SIZE1, LEN_OF_MARKER);
        if (length === undefined) {
          return;
        }
        return parseValueDict.call(this, length);
      }
    case MARKER.VAL_DICT2:
      {
        var length = parseLength.call(this, LEN_OF_SIZE2, LEN_OF_MARKER);
        if (length === undefined) {
          return;
        }
        return parseValueDict.call(this, length);
      }
    case MARKER.VAL_DICT4:
      {
        var length = parseLength.call(this, LEN_OF_SIZE4, LEN_OF_MARKER);
        if (length === undefined) {
          return;
        }
        return parseValueDict.call(this, length);
      }

    // List
    case MARKER.VAL_LIST1:
      {
        var length = parseLength.call(this, LEN_OF_SIZE1, LEN_OF_MARKER);
        if (length === undefined) {
          return;
        }
        return parseValueList.call(this, length);
      }
    case MARKER.VAL_LIST2:
      {
        var length = parseLength.call(this, LEN_OF_SIZE2, LEN_OF_MARKER);
        if (length === undefined) {
          return;
        }
        return parseValueList.call(this, length);
      }
    case MARKER.VAL_LIST4:
      {
        var length = parseLength.call(this, LEN_OF_SIZE4, LEN_OF_MARKER);
        if (length === undefined) {
          return;
        }
        return parseValueList.call(this, length);
      }

    // String
    case MARKER.VAL_STR1:
      {
        var length = parseLength.call(this, LEN_OF_SIZE1, LEN_OF_MARKER);
        if (length === undefined) {
          return;
        }
        return this.consumeString(length);
      }
    case MARKER.VAL_STR2:
      {
        var length = parseLength.call(this, LEN_OF_SIZE2, LEN_OF_MARKER);
        if (length === undefined) {
          return;
        }
        return this.consumeString(length);
      }
    case MARKER.VAL_STR4:
      {
        var length = parseLength.call(this, LEN_OF_SIZE4, LEN_OF_MARKER);
        if (length === undefined) {
          return;
        }
        return this.consumeString(length);
      }

    // Binary
    case MARKER.VAL_BIN1:
      {
        var length = parseLength.call(this, LEN_OF_SIZE1, LEN_OF_MARKER);
        if (length === undefined) {
          return;
        }
        return this.consumeBinary(length);
      }
    case MARKER.VAL_BIN2:
      {
        var length = parseLength.call(this, LEN_OF_SIZE2, LEN_OF_MARKER);
        if (length === undefined) {
          return;
        }
        return this.consumeBinary(length);
      }
    case MARKER.VAL_BIN4:
      {
        var length = parseLength.call(this, LEN_OF_SIZE4, LEN_OF_MARKER);
        if (length === undefined) {
          return;
        }
        return this.consumeBinary(length);
      }

    // Number
    case MARKER.VAL_INT8:
      {
        return this.consumeInt8(LEN_OF_MARKER);
      }
    case MARKER.VAL_INT16:
      {
        return this.consumeInt16(LEN_OF_MARKER);
      }
    case MARKER.VAL_INT32:
      {
        return this.consumeInt32(LEN_OF_MARKER);
      }
    case MARKER.VAL_INT64:
      {
        return this.consumeInt64(LEN_OF_MARKER);
      }

    case MARKER.VAL_FLOAT:
      {
        return this.consumeFloat(LEN_OF_MARKER);
      }
    case MARKER.VAL_DOUBLE:
      {
        return this.consumeDouble(LEN_OF_MARKER);
      }

    // Boolean
    case MARKER.VAL_FALSE:
      {
        return this.consume(LEN_OF_MARKER, false);
      }
    case MARKER.VAL_TRUE:
      {
        return this.consume(LEN_OF_MARKER, true);
      }

    // Null
    case MARKER.VAL_NULL:
      {
        return this.consume(LEN_OF_MARKER, null);
      }
  }
}

/**
 * Key
 */
function parseKey() {
  switch (this.readMarker()) {
    case MARKER.KEY_STR1:
      {
        var length = parseLength.call(this, LEN_OF_SIZE1, LEN_OF_MARKER);
        if (length === undefined) {
          return;
        }
        return this.consumeString(length);
      }
    case MARKER.KEY_STR2:
      {
        var length = parseLength.call(this, LEN_OF_SIZE2, LEN_OF_MARKER);
        if (length === undefined) {
          return;
        }
        return this.consumeString(length);
      }
  }
}

/**
 * Length
 */
function parseLength(size) {
  var relOffset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

  switch (size) {
    case LEN_OF_SIZE1:
      {
        var length = this.consumeUInt8(relOffset);
        if (length === undefined) {
          return;
        }
        if (this.available(length)) {
          return length;
        }
        this.rewind(LEN_OF_SIZE1 + relOffset);
        return;
      }
    case LEN_OF_SIZE2:
      {
        var length = this.consumeUInt16(relOffset);
        if (length === undefined) {
          return;
        }
        if (this.available(length)) {
          return length;
        }
        this.rewind(LEN_OF_SIZE2 + relOffset);
        return;
      }
    case LEN_OF_SIZE4:
      {
        var length = this.consumeUInt32(relOffset);
        if (length === undefined) {
          return;
        }
        if (this.available(length)) {
          return length;
        }
        this.rewind(LEN_OF_SIZE4 + relOffset);
        return;
      }
  }
}

/**
 * Value : Dict
 */
function parseValueDict(length) {
  var eoc = this.offset + length;
  var dict = Object.create(null);
  while (this.offset < eoc && this.offset < this.buffer.length) {
    var key = this.parseKey();
    if (key === undefined) {
      break;
    }
    var value = this.parseValue();
    if (value === undefined) {
      break;
    }
    dict[key] = value;
  }
  this.offset = eoc;
  return dict;
}

/**
 * Value : List
 */
function parseValueList(length) {
  var eoc = this.offset + length;
  var list = [];
  while (this.offset < eoc && this.offset < this.buffer.length) {
    var value = this.parseValue();
    if (value === undefined) {
      break;
    }
    list.push(value);
  }
  this.offset = eoc;
  return list;
}