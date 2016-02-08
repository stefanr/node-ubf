"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ParseError = exports.Context = exports.Parser = undefined;

var _parserAbstract = require("./parser-abstract");

var _modContext = require("./mod-context");

var _modBase = require("./mod-base");

var base = _interopRequireWildcard(_modBase);

var _modConstPool = require("./mod-const-pool");

var constPool = _interopRequireWildcard(_modConstPool);

var _modChunks = require("./mod-chunks");

var chunks = _interopRequireWildcard(_modChunks);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Universal Binary Format
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ubf
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var Parser = exports.Parser = function (_AbstractParser) {
  _inherits(Parser, _AbstractParser);

  function Parser(context) {
    _classCallCheck(this, Parser);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Parser).call(this));

    _this.context = context || new _modContext.Context();
    _this.chunkStack = [];
    return _this;
  }

  _createClass(Parser, [{
    key: "parse",
    value: function parse(buffer) {
      if (this.buffer && this.offset < this.buffer.length) {
        var buffer_ = Buffer.concat([this.buffer.slice(this.offset | 0), buffer]);
        this.resetBuffer(buffer_);
      } else {
        this.resetBuffer(buffer);
      }

      this.parsing = true;
      this.truncated = false;

      while (this.offset < this.buffer.length && this.parsing) {
        // ControlDirective
        if (this.parseControlDirective()) {
          continue;
        }

        // Value
        var value = this.parseValue();
        if (value === chunks.CHUNK_BEGIN) {
          continue;
        } else if (value !== undefined) {
          var lvl = this.chunkStack.length;
          if (lvl) {
            var chk = this.chunkStack[lvl - 1];
            if (chk.k) {
              chk.v[chk.k] = value;
            } else {
              chk.v.push(value);
            }
          } else {
            this.context.emit("value", { value: value });
          }
          continue;
        } else if (this.truncated) {
          this.context._handleTruncated();
          break;
        }

        // Entry
        var key = this.parseKey();
        if (key !== undefined) {
          var lvl = this.chunkStack.length;
          var chk = lvl && this.chunkStack[lvl - 1];
          value = this.parseValue();
          if (value === chunks.CHUNK_BEGIN) {
            chk.k = key;
            continue;
          } else if (value !== undefined) {
            if (chk) {
              chk.v[key] = value;
            } else {
              this.context.global[key] = value;
              this.context.emit("global", { key: key, value: value });
            }
            continue;
          } else if (this.truncated) {
            this.context._handleTruncated();
            break;
          }

          // Error: Value expected
          var _err = new ParseError("Value expected", {
            code: ParseError.Code.ERR_VALUE_EXPECTED,
            buffer: this.buffer,
            offset: this.offset
          });
          this.context.emit("error", _err);
          this.resetBuffer();
          break;
        } else if (this.truncated) {
          this.context._handleTruncated();
          break;
        }

        // Error: Unknown marker
        var err = new ParseError("Unknown marker", {
          code: ParseError.Code.UNKNOWN_MARKER,
          buffer: this.buffer,
          offset: this.offset,
          marker: this.readMarker()
        });
        this.context.emit("error", err);
        this.resetBuffer();
        break;
      }
    }
  }, {
    key: "_handleTruncated",
    value: function _handleTruncated() {
      this.context.emit("truncated", {
        buffer: this.buffer,
        offset: this.offset
      });
    }
  }, {
    key: "stop",
    value: function stop() {
      this.parsing = false;
    }
  }, {
    key: "parseControlDirective",
    value: function parseControlDirective() {
      return base.parseControlDirective.call(this);
    }
  }, {
    key: "parseValue",
    value: function parseValue() {
      // Base / Value
      var value = base.parseValue.call(this);
      // Constant Pool / Value
      if (value === undefined) {
        value = constPool.parseValue.call(this);
      }
      // Chunks / Value
      if (value === undefined) {
        value = chunks.parseValue.call(this);
      }
      return value;
    }
  }, {
    key: "parseKey",
    value: function parseKey() {
      // Base / Key
      var key = base.parseKey.call(this);
      // Constant Pool / Key
      if (key === undefined) {
        key = constPool.parseKey.call(this);
      }
      return key;
    }
  }]);

  return Parser;
}(_parserAbstract.AbstractParser);

exports.Context = _modContext.Context;

var ParseError = exports.ParseError = function (_Error) {
  _inherits(ParseError, _Error);

  function ParseError(message, detail) {
    _classCallCheck(this, ParseError);

    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(ParseError).call(this, message));

    _this2.name = "ParseError";
    _this2.message = message || "Unknown error";
    _this2.detail = detail || {};
    if (Error.captureStackTrace) {
      Error.captureStackTrace(_this2, ParseError);
    }
    return _this2;
  }

  return ParseError;
}(Error);

ParseError.Code = {
  UNKNOWN_MARKER: 0x01,
  VALUE_EXPECTED: 0x02
};