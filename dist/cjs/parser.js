"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Parser = exports.ParserContext = undefined;

var _parserAbstract = require("./parser-abstract");

var _base = require("./parser/base");

var __base = _interopRequireWildcard(_base);

var _context = require("./parser/context");

var __ctxt = _interopRequireWildcard(_context);

var _chunks = require("./parser/chunks");

var __chnk = _interopRequireWildcard(_chunks);

var _constPool = require("./parser/const-pool");

var __pool = _interopRequireWildcard(_constPool);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Universal Binary Format
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ubf
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var ParserContext = __ctxt.ParserContext;
exports.ParserContext = ParserContext;

var Parser = exports.Parser = function (_AbstractParser) {
  _inherits(Parser, _AbstractParser);

  function Parser(context) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, Parser);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Parser).call(this));

    _this.options = {};

    _this.context = context || new ParserContext();
    _extends(_this.options, options);
    _this._chunkStack = [];
    return _this;
  }

  _createClass(Parser, [{
    key: "parse",
    value: function parse(buffer) {
      if (this.buffer && this.offset < this.buffer.length) {
        var rest = this.buffer.slice(this.offset | 0);
        this._resetBuffer(Buffer.concat([rest, buffer]));
      } else {
        this._resetBuffer(buffer);
      }
      this.parsing = true;

      while (this.parsing && this.buffer && this.offset < this.buffer.length) {
        // ControlDirective
        if (this._parseControlDirective()) {
          continue;
        }

        // Value
        var value = this._parseValue();
        if (value instanceof __chnk.Chunk) {
          continue;
        } else if (value !== undefined) {
          var chunkDepth = this._chunkStack.length;
          if (chunkDepth) {
            var chunk = this._chunkStack[chunkDepth - 1];
            if (chunk.key) {
              chunk.value[chunk.key] = value;
            } else {
              chunk.value.push(value);
            }
          } else {
            this._handleValue(value);
          }
          continue;
        } else if (this._truncated) {
          this._handleTruncated();
          break;
        }

        var syncOffset = this.offset;

        // Entry
        var key = this._parseKey();
        if (key !== undefined) {
          var chunkDepth = this._chunkStack.length;
          var chunk = this._chunkStack[chunkDepth - 1];
          value = this._parseValue();
          if (value instanceof __chnk.Chunk) {
            chunk.key = key;
            continue;
          } else if (value !== undefined) {
            if (chunk) {
              chunk.value[key] = value;
            } else {
              this._handleEntry(key, value);
            }
            continue;
          } else if (this._truncated) {
            this.offset = syncOffset;
            this._handleTruncated();
            break;
          }

          // Error: Value expected
          this._handleError("Value expected", {
            code: ParseError.Code.VALUE_EXPECTED
          });
          break;
        } else if (this._truncated) {
          this._handleTruncated();
          break;
        }

        // Error: Unknown marker
        this._handleError("Unknown marker", {
          code: ParseError.Code.UNKNOWN_MARKER,
          marker: this.readMarker()
        });
        break;
      }
    }
  }, {
    key: "reset",
    value: function reset() {
      this._chunkStack.length = 0;
      this._resetBuffer();
    }
  }, {
    key: "_handleValue",
    value: function _handleValue(value) {
      this.context.emit("value", { value: value });
    }
  }, {
    key: "_handleEntry",
    value: function _handleEntry(key, value) {
      var oldValue = this.context.global[key];
      this.context.global[key] = value;
      this.context.emit("global", { key: key, value: value, oldValue: oldValue });
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
      this.reset();
    }
  }, {
    key: "_parseControlDirective",
    value: function _parseControlDirective() {
      // Base : Control Directive
      return __base.parseControlDirective.call(this);
    }
  }, {
    key: "_parseValue",
    value: function _parseValue() {
      // Base : Value
      var value = __base.parseValue.call(this);
      // Chunks : Value
      if (value === undefined) {
        value = __chnk.parseValue.call(this);
      }
      // Constant Pool : Value
      if (value === undefined) {
        value = __pool.parseValue.call(this);
      }
      return value;
    }
  }, {
    key: "_parseKey",
    value: function _parseKey() {
      // Base : Key
      var key = __base.parseKey.call(this);
      // Constant Pool : Key
      if (key === undefined) {
        key = __pool.parseKey.call(this);
      }
      return key;
    }
  }]);

  return Parser;
}(_parserAbstract.AbstractParser);

var ParseError = function (_Error) {
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