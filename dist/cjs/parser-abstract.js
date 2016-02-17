"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Universal Binary Format
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @module ubf
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AbstractParser = undefined;

var _nodeInt = require("node-int64");

var _nodeInt2 = _interopRequireDefault(_nodeInt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AbstractParser = exports.AbstractParser = function () {
  function AbstractParser() {
    _classCallCheck(this, AbstractParser);
  }

  _createClass(AbstractParser, [{
    key: "_resetBuffer",
    value: function _resetBuffer(buffer) {
      this.buffer = buffer || null;
      this.offset = 0;
      this._truncated = false;
    }

    // Read Operations -------------------------------------------------

  }, {
    key: "_available",
    value: function _available(length) {
      var relOffset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      if (this.offset + relOffset + length > this.buffer.length) {
        this._truncated = true;
        return false;
      }
      return true;
    }
  }, {
    key: "_readMarker",
    value: function _readMarker() {
      var offset = arguments.length <= 0 || arguments[0] === undefined ? this.offset : arguments[0];

      if (this._available(1)) {
        return this._readUInt8(offset | 0);
      }
    }
  }, {
    key: "_readInt8",
    value: function _readInt8(offset) {
      return +this.buffer.readInt8(offset | 0, true);
    }
  }, {
    key: "_readUInt8",
    value: function _readUInt8(offset) {
      return +this.buffer.readUInt8(offset | 0, true);
    }
  }, {
    key: "_readInt16",
    value: function _readInt16(offset) {
      return +this.buffer.readInt16BE(offset | 0, true);
    }
  }, {
    key: "_readUInt16",
    value: function _readUInt16(offset) {
      return +this.buffer.readUInt16BE(offset | 0, true);
    }
  }, {
    key: "_readInt32",
    value: function _readInt32(offset) {
      return +this.buffer.readInt32BE(offset | 0, true);
    }
  }, {
    key: "_readUInt32",
    value: function _readUInt32(offset) {
      return +this.buffer.readUInt32BE(offset | 0, true);
    }
  }, {
    key: "_readInt64",
    value: function _readInt64(offset) {
      return +new _nodeInt2.default(this.buffer, offset | 0).toNumber(false);
    }
  }, {
    key: "_readFloat",
    value: function _readFloat(offset) {
      return +this.buffer.readFloatBE(offset | 0, true);
    }
  }, {
    key: "_readDouble",
    value: function _readDouble(offset) {
      return +this.buffer.readDoubleBE(offset | 0, true);
    }
  }, {
    key: "_readString",
    value: function _readString(offset, length) {
      return this.buffer.toString("utf8", offset | 0, offset + length | 0);
    }
  }, {
    key: "_readBinary",
    value: function _readBinary(offset, length) {
      return this.buffer.slice(offset | 0, offset + length | 0);
    }

    // Consume Operations ----------------------------------------------

  }, {
    key: "_consume",
    value: function _consume(length, value) {
      this.offset += length | 0;
      return value;
    }
  }, {
    key: "_rewind",
    value: function _rewind(length) {
      this.offset -= length | 0;
    }
  }, {
    key: "_consumeInt8",
    value: function _consumeInt8() {
      var relOffset = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      if (this._available(1, relOffset)) {
        var value = this._readInt8(this.offset + relOffset);
        return this._consume(1 + relOffset, value);
      }
    }
  }, {
    key: "_consumeUInt8",
    value: function _consumeUInt8() {
      var relOffset = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      if (this._available(1, relOffset)) {
        var value = this._readUInt8(this.offset + relOffset);
        return this._consume(1 + relOffset, value);
      }
    }
  }, {
    key: "_consumeInt16",
    value: function _consumeInt16() {
      var relOffset = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      if (this._available(2, relOffset)) {
        var value = this._readInt16(this.offset + relOffset);
        return this._consume(2 + relOffset, value);
      }
    }
  }, {
    key: "_consumeUInt16",
    value: function _consumeUInt16() {
      var relOffset = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      if (this._available(2, relOffset)) {
        var value = this._readUInt16(this.offset + relOffset);
        return this._consume(2 + relOffset, value);
      }
    }
  }, {
    key: "_consumeInt32",
    value: function _consumeInt32() {
      var relOffset = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      if (this._available(4, relOffset)) {
        var value = this._readInt32(this.offset + relOffset);
        return this._consume(4 + relOffset, value);
      }
    }
  }, {
    key: "_consumeUInt32",
    value: function _consumeUInt32() {
      var relOffset = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      if (this._available(4, relOffset)) {
        var value = this._readUInt32(this.offset + relOffset);
        return this._consume(4 + relOffset, value);
      }
    }
  }, {
    key: "_consumeInt64",
    value: function _consumeInt64() {
      var relOffset = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      if (this._available(8, relOffset)) {
        var value = this._readInt64(this.offset + relOffset);
        return this._consume(8 + relOffset, value);
      }
    }
  }, {
    key: "_consumeFloat",
    value: function _consumeFloat() {
      var relOffset = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      if (this._available(4, relOffset)) {
        var value = this._readFloat(this.offset + relOffset);
        return this._consume(4 + relOffset, value);
      }
    }
  }, {
    key: "_consumeDouble",
    value: function _consumeDouble() {
      var relOffset = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      if (this._available(8, relOffset)) {
        var value = this._readDouble(this.offset + relOffset);
        return this._consume(8 + relOffset, value);
      }
    }
  }, {
    key: "_consumeString",
    value: function _consumeString(length) {
      var relOffset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      if (this._available(length, relOffset)) {
        var value = this._readString(this.offset + relOffset, length);
        return this._consume(length + relOffset, value);
      }
    }
  }, {
    key: "_consumeBinary",
    value: function _consumeBinary(length) {
      var relOffset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      if (this._available(length, relOffset)) {
        var value = this._readBinary(this.offset + relOffset, length);
        return this._consume(length + relOffset, value);
      }
    }
  }]);

  return AbstractParser;
}();