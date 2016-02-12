"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ParseError = exports.Context = exports.Parser = undefined;

var _parserAbstract = require("./parser-abstract");

var _modContext = require("./mod-context");

var _modBase = require("./mod-base");

var base = _interopRequireWildcard(_modBase);

var _modChunks = require("./mod-chunks");

var chunks = _interopRequireWildcard(_modChunks);

var _modConstPool = require("./mod-const-pool");

var constPool = _interopRequireWildcard(_modConstPool);

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
        var rest = this.buffer.slice(this.offset | 0);
        this.resetBuffer(Buffer.concat([rest, buffer]));
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
        if (value instanceof chunks.Chunk) {
          continue;
        } else if (value !== undefined) {
          var chunkDepth = this.chunkStack.length;
          if (chunkDepth) {
            var chunk = this.chunkStack[chunkDepth - 1];
            if (chunk.type === "D") {
              chunk.value[chunk.key] = value;
            } else {
              chunk.value.push(value);
            }
          } else {
            this._handleValue(value);
          }
          continue;
        } else if (this.truncated) {
          this._handleTruncated();
          break;
        }

        var syncOffset = this.offset;

        // Entry
        var key = this.parseKey();
        if (key !== undefined) {
          var chunkDepth = this.chunkStack.length;
          var chunk = this.chunkStack[chunkDepth - 1];
          value = this.parseValue();
          if (value instanceof chunks.Chunk) {
            chunk.key = key;
            continue;
          } else if (value !== undefined) {
            if (chunk) {
              chunk.value[key] = value;
            } else {
              this._handleEntry(key, value);
            }
            continue;
          } else if (this.truncated) {
            this.offset = syncOffset;
            this._handleTruncated();
            break;
          }

          // Error: Value expected
          this._handleError("Value expected", {
            code: ParseError.Code.VALUE_EXPECTED
          });
          this.resetBuffer();
          break;
        } else if (this.truncated) {
          this._handleTruncated();
          break;
        }

        // Error: Unknown marker
        this._handleError("Unknown marker", {
          code: ParseError.Code.UNKNOWN_MARKER,
          marker: this.readMarker()
        });
        this.resetBuffer();
        break;
      }
    }
  }, {
    key: "stop",
    value: function stop() {
      this.parsing = false;
    }
  }, {
    key: "_handleValue",
    value: function _handleValue(value) {
      this.context.emit("value", { value: value });
    }
  }, {
    key: "_handleEntry",
    value: function _handleEntry(key, value) {
      this.context.global[key] = value;
      this.context.emit("global", { key: key, value: value });
    }
  }, {
    key: "_handleTruncated",
    value: function _handleTruncated() {
      var buffer = this.buffer;
      var offset = this.offset;

      this.context.emit("truncated", { buffer: buffer, offset: offset });
    }
  }, {
    key: "_handleError",
    value: function _handleError(msg, data) {
      var buffer = this.buffer;
      var offset = this.offset;

      var detail = _extends({ code: -1, buffer: buffer, offset: offset }, data);
      this.context.emit("error", new ParseError(msg, detail));
    }
  }, {
    key: "parseControlDirective",
    value: function parseControlDirective() {
      return base.parseControlDirective.call(this);
    }
  }, {
    key: "parseValue",
    value: function parseValue() {
      if (!this.available(base.LEN_OF_MARKER)) {
        return;
      }
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