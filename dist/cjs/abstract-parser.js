/*
 * Universal Binary Format
 * AbstractParser
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x14, _x15, _x16) { var _again = true; _function: while (_again) { var object = _x14, property = _x15, receiver = _x16; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x14 = parent; _x15 = property; _x16 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _yaee = require("yaee");

var _nodeInt64 = require("node-int64");

var _nodeInt642 = _interopRequireDefault(_nodeInt64);

/**
 * AbstractParser
 */

var AbstractParser = (function (_EventEmitter) {
  _inherits(AbstractParser, _EventEmitter);

  function AbstractParser() {
    _classCallCheck(this, AbstractParser);

    _get(Object.getPrototypeOf(AbstractParser.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(AbstractParser, [{
    key: "resetBuffer",
    value: function resetBuffer(buffer) {
      this.buffer = buffer || null;
      this.offset = 0;
    }
  }, {
    key: "readMarker",
    value: function readMarker() {
      var offset = arguments.length <= 0 || arguments[0] === undefined ? this.offset : arguments[0];

      return this.readUInt8(offset | 0) | 0;
    }
  }, {
    key: "available",
    value: function available(length) {
      var relOffset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      if (this.offset + relOffset + length > this.buffer.length) {
        this.truncated = true;
        return false;
      }
      return true;
    }

    // Read operations -------------------------------------------------

  }, {
    key: "readInt8",
    value: function readInt8(offset) {
      return +this.buffer.readInt8(offset | 0, true);
    }
  }, {
    key: "readUInt8",
    value: function readUInt8(offset) {
      return +this.buffer.readUInt8(offset | 0, true);
    }
  }, {
    key: "readInt16",
    value: function readInt16(offset) {
      return +this.buffer.readInt16BE(offset | 0, true);
    }
  }, {
    key: "readUInt16",
    value: function readUInt16(offset) {
      return +this.buffer.readUInt16BE(offset | 0, true);
    }
  }, {
    key: "readInt32",
    value: function readInt32(offset) {
      return +this.buffer.readInt32BE(offset | 0, true);
    }
  }, {
    key: "readUInt32",
    value: function readUInt32(offset) {
      return +this.buffer.readUInt32BE(offset | 0, true);
    }
  }, {
    key: "readInt64",
    value: function readInt64(offset) {
      return +new _nodeInt642["default"](this.buffer, offset | 0).toNumber(false);
    }
  }, {
    key: "readFloat",
    value: function readFloat(offset) {
      return +this.buffer.readFloatBE(offset | 0, true);
    }
  }, {
    key: "readDouble",
    value: function readDouble(offset) {
      return +this.buffer.readDoubleBE(offset | 0, true);
    }
  }, {
    key: "readString",
    value: function readString(offset, length) {
      return this.buffer.toString("utf8", offset | 0, offset + length | 0);
    }
  }, {
    key: "readBinary",
    value: function readBinary(offset, length) {
      return this.buffer.slice(offset | 0, offset + length | 0);
    }

    // Consume operations ----------------------------------------------

  }, {
    key: "consume",
    value: function consume(length, value) {
      this.offset += length | 0;
      return value;
    }
  }, {
    key: "rewind",
    value: function rewind(length) {
      this.offset -= length | 0;
    }
  }, {
    key: "consumeInt8",
    value: function consumeInt8() {
      var relOffset = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      if (!this.available(1, relOffset)) {
        return;
      }
      return +this.consume(1 + relOffset, +this.readInt8(this.offset + relOffset));
    }
  }, {
    key: "consumeUInt8",
    value: function consumeUInt8() {
      var relOffset = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      if (!this.available(1, relOffset)) {
        return;
      }
      return +this.consume(1 + relOffset, +this.readUInt8(this.offset + relOffset));
    }
  }, {
    key: "consumeInt16",
    value: function consumeInt16() {
      var relOffset = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      if (!this.available(2, relOffset)) {
        return;
      }
      return +this.consume(2 + relOffset, +this.readInt16(this.offset + relOffset));
    }
  }, {
    key: "consumeUInt16",
    value: function consumeUInt16() {
      var relOffset = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      if (!this.available(2, relOffset)) {
        return;
      }
      return +this.consume(2 + relOffset, +this.readUInt16(this.offset + relOffset));
    }
  }, {
    key: "consumeInt32",
    value: function consumeInt32() {
      var relOffset = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      if (!this.available(4, relOffset)) {
        return;
      }
      return +this.consume(4 + relOffset, +this.readInt32(this.offset + relOffset));
    }
  }, {
    key: "consumeUInt32",
    value: function consumeUInt32() {
      var relOffset = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      if (!this.available(4, relOffset)) {
        return;
      }
      return +this.consume(4 + relOffset, +this.readUInt32(this.offset + relOffset));
    }
  }, {
    key: "consumeInt64",
    value: function consumeInt64() {
      var relOffset = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      if (!this.available(8, relOffset)) {
        return;
      }
      return +this.consume(8 + relOffset, +this.readInt64(this.offset + relOffset));
    }
  }, {
    key: "consumeFloat",
    value: function consumeFloat() {
      var relOffset = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      if (!this.available(4, relOffset)) {
        return;
      }
      return +this.consume(4 + relOffset, +this.readFloat(this.offset + relOffset));
    }
  }, {
    key: "consumeDouble",
    value: function consumeDouble() {
      var relOffset = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      if (!this.available(8, relOffset)) {
        return;
      }
      return +this.consume(8 + relOffset, +this.readDouble(this.offset + relOffset));
    }
  }, {
    key: "consumeString",
    value: function consumeString(length) {
      var relOffset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      if (!this.available(length, relOffset)) {
        return;
      }
      return this.consume(length + relOffset, this.readString(this.offset + relOffset, length));
    }
  }, {
    key: "consumeBinary",
    value: function consumeBinary(length) {
      var relOffset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      if (!this.available(length, relOffset)) {
        return;
      }
      return this.consume(length + relOffset, this.readBinary(this.offset + relOffset, length));
    }
  }]);

  return AbstractParser;
})(_yaee.EventEmitter);

exports.AbstractParser = AbstractParser;