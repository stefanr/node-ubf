"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseControlDirective = parseControlDirective;
exports.parseValue = parseValue;
exports.parseKey = parseKey;
exports.parseLength = parseLength;
exports.parseValueDict = parseValueDict;
exports.parseValueList = parseValueList;

var _info = require("../info");

var _markers = require("../markers");

var MARKER = _interopRequireWildcard(_markers);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Universal Binary Format
 * @module ubf
 */
function parseControlDirective() {
  switch (this._readMarker()) {
    case MARKER.CTRL_HEADER:
      {
        this._consume(_info.LEN.MARKER);
        // TODO
        return true;
      }
  }
}

function parseValue() {
  switch (this._readMarker()) {
    // Dict
    case MARKER.VAL_DICT1:
      {
        var length = parseLength.call(this, _info.LEN.SIZE1, _info.LEN.MARKER);
        if (length !== undefined) {
          return parseValueDict.call(this, length);
        }
        return;
      }
    case MARKER.VAL_DICT2:
      {
        var length = parseLength.call(this, _info.LEN.SIZE2, _info.LEN.MARKER);
        if (length !== undefined) {
          return parseValueDict.call(this, length);
        }
        return;
      }
    case MARKER.VAL_DICT4:
      {
        var length = parseLength.call(this, _info.LEN.SIZE4, _info.LEN.MARKER);
        if (length !== undefined) {
          return parseValueDict.call(this, length);
        }
        return;
      }

    // List
    case MARKER.VAL_LIST1:
      {
        var length = parseLength.call(this, _info.LEN.SIZE1, _info.LEN.MARKER);
        if (length !== undefined) {
          return parseValueList.call(this, length);
        }
        return;
      }
    case MARKER.VAL_LIST2:
      {
        var length = parseLength.call(this, _info.LEN.SIZE2, _info.LEN.MARKER);
        if (length !== undefined) {
          return parseValueList.call(this, length);
        }
        return;
      }
    case MARKER.VAL_LIST4:
      {
        var length = parseLength.call(this, _info.LEN.SIZE4, _info.LEN.MARKER);
        if (length !== undefined) {
          return parseValueList.call(this, length);
        }
        return;
      }

    // String
    case MARKER.VAL_STR1:
      {
        var length = parseLength.call(this, _info.LEN.SIZE1, _info.LEN.MARKER);
        if (length !== undefined) {
          return this._consumeString(length);
        }
        return;
      }
    case MARKER.VAL_STR2:
      {
        var length = parseLength.call(this, _info.LEN.SIZE2, _info.LEN.MARKER);
        if (length !== undefined) {
          return this._consumeString(length);
        }
        return;
      }
    case MARKER.VAL_STR4:
      {
        var length = parseLength.call(this, _info.LEN.SIZE4, _info.LEN.MARKER);
        if (length !== undefined) {
          return this._consumeString(length);
        }
        return;
      }

    // Binary
    case MARKER.VAL_BIN1:
      {
        var length = parseLength.call(this, _info.LEN.SIZE1, _info.LEN.MARKER);
        if (length !== undefined) {
          return this._consumeBinary(length);
        }
        return;
      }
    case MARKER.VAL_BIN2:
      {
        var length = parseLength.call(this, _info.LEN.SIZE2, _info.LEN.MARKER);
        if (length !== undefined) {
          return this._consumeBinary(length);
        }
        return;
      }
    case MARKER.VAL_BIN4:
      {
        var length = parseLength.call(this, _info.LEN.SIZE4, _info.LEN.MARKER);
        if (length !== undefined) {
          return this._consumeBinary(length);
        }
        return;
      }

    // Number
    case MARKER.VAL_INT8:
      {
        return this._consumeInt8(_info.LEN.MARKER);
      }
    case MARKER.VAL_INT16:
      {
        return this._consumeInt16(_info.LEN.MARKER);
      }
    case MARKER.VAL_INT32:
      {
        return this._consumeInt32(_info.LEN.MARKER);
      }
    case MARKER.VAL_INT64:
      {
        return this._consumeInt64(_info.LEN.MARKER);
      }

    case MARKER.VAL_FLOAT:
      {
        return this._consumeFloat(_info.LEN.MARKER);
      }
    case MARKER.VAL_DOUBLE:
      {
        return this._consumeDouble(_info.LEN.MARKER);
      }

    // Boolean
    case MARKER.VAL_FALSE:
      {
        return this._consume(_info.LEN.MARKER, false);
      }
    case MARKER.VAL_TRUE:
      {
        return this._consume(_info.LEN.MARKER, true);
      }

    // Null
    case MARKER.VAL_NULL:
      {
        return this._consume(_info.LEN.MARKER, null);
      }
  }
}

function parseKey() {
  switch (this._readMarker()) {
    case MARKER.KEY_STR1:
      {
        var length = parseLength.call(this, _info.LEN.SIZE1, _info.LEN.MARKER);
        if (length !== undefined) {
          return this._consumeString(length);
        }
        return;
      }
    case MARKER.KEY_STR2:
      {
        var length = parseLength.call(this, _info.LEN.SIZE2, _info.LEN.MARKER);
        if (length !== undefined) {
          return this._consumeString(length);
        }
        return;
      }
  }
}

function parseLength(size) {
  var relOffset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

  switch (size) {
    case _info.LEN.SIZE1:
      {
        var length = this._consumeUInt8(relOffset);
        if (length === undefined) {
          return;
        }
        if (this._available(length)) {
          return length;
        }
        this._rewind(_info.LEN.SIZE1 + relOffset);
        return;
      }
    case _info.LEN.SIZE2:
      {
        var length = this._consumeUInt16(relOffset);
        if (length === undefined) {
          return;
        }
        if (this._available(length)) {
          return length;
        }
        this._rewind(_info.LEN.SIZE2 + relOffset);
        return;
      }
    case _info.LEN.SIZE4:
      {
        var length = this._consumeUInt32(relOffset);
        if (length === undefined) {
          return;
        }
        if (this._available(length)) {
          return length;
        }
        this._rewind(_info.LEN.SIZE4 + relOffset);
        return;
      }
  }
}

function parseValueDict(length) {
  var eoc = this.offset + length;
  var dict = {};
  while (this.offset < eoc && this.offset < this.buffer.length) {
    var key = this._parseKey();
    if (key === undefined) {
      break;
    }
    var value = this._parseValue();
    if (value === undefined) {
      break;
    }
    dict[key] = value;
  }
  this.offset = eoc;
  return dict;
}

function parseValueList(length) {
  var eoc = this.offset + length;
  var list = [];
  while (this.offset < eoc && this.offset < this.buffer.length) {
    var value = this._parseValue();
    if (value === undefined) {
      break;
    }
    list.push(value);
  }
  this.offset = eoc;
  return list;
}