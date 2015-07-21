System.register(["yaee", "./abstract-parser", "./base-parser", "./ext-object-pool"], function (_export) {
  /*
   * Universal Binary Format
   * Parser
   */
  "use strict";

  var EventEmitter, AbstractParser, base, objectPool, ERR_UNKNOWN_MARKER, ERR_VALUE_EXPECTED, Parser, ParseError;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

  return {
    setters: [function (_yaee) {
      EventEmitter = _yaee.EventEmitter;
    }, function (_abstractParser) {
      AbstractParser = _abstractParser.AbstractParser;
    }, function (_baseParser) {
      base = _baseParser;
    }, function (_extObjectPool) {
      objectPool = _extObjectPool;
    }],
    execute: function () {

      /**
       * Error Codes
       */
      ERR_UNKNOWN_MARKER = 0x01;

      _export("ERR_UNKNOWN_MARKER", ERR_UNKNOWN_MARKER);

      ERR_VALUE_EXPECTED = 0x02;

      _export("ERR_VALUE_EXPECTED", ERR_VALUE_EXPECTED);

      /**
       * Parser
       */

      Parser = (function (_AbstractParser) {
        _inherits(Parser, _AbstractParser);

        function Parser(context) {
          _classCallCheck(this, Parser);

          _get(Object.getPrototypeOf(Parser.prototype), "constructor", this).call(this);
          this.context = context;
        }

        _createClass(Parser, [{
          key: "parse",
          value: function parse(buffer) {
            if (this.buffer && this.offset < this.buffer.length) {
              this.resetBuffer(Buffer.concat([this.buffer.slice(this.offset | 0), buffer]));
            } else {
              this.resetBuffer(buffer);
            }

            this.parsing = true;
            this.truncated = false;

            while (this.offset < this.buffer.length && this.parsing) {
              // ControlDirective ------------------------
              if (this.parseControlDirective()) {
                continue;
              }

              // Value -----------------------------------
              var value = this.parseValue();
              if (value !== undefined) {
                this.emit("value", { value: value });
                continue;
              } else if (this.truncated) {
                this.emit("truncated", {
                  buffer: this.buffer,
                  offset: this.offset
                });
                break;
              }

              // Key Value -------------------------------
              var key = this.parseKey();
              if (key !== undefined) {
                var _value = this.parseValue();
                if (_value !== undefined) {
                  this.context.global[key] = _value;
                  this.emit("global", { key: key, value: _value });
                  continue;
                } else if (this.truncated) {
                  this.emit("truncated", {
                    buffer: this.buffer,
                    offset: this.offset
                  });
                  break;
                }

                // Value expected ------------------------
                this.emit("error", new ParseError("Value expected", {
                  code: ERR_VALUE_EXPECTED,
                  buffer: this.buffer,
                  offset: this.offset
                }));
                this.resetBuffer();
                break;
              } else if (this.truncated) {
                this.emit("truncated", {
                  buffer: this.buffer,
                  offset: this.offset
                });
                break;
              }

              // Unknown marker --------------------------
              this.emit("error", new ParseError("Unknown marker", {
                code: ERR_UNKNOWN_MARKER,
                buffer: this.buffer,
                offset: this.offset,
                marker: this.readMarker()
              }));
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
          key: "parseControlDirective",
          value: function parseControlDirective() {
            return base.parseControlDirective.call(this);
          }
        }, {
          key: "parseValue",
          value: function parseValue() {
            // Base Profile : Value ----------------------
            var value = base.parseValue.call(this);
            // Object Pool Extension : Value -------------
            if (value === undefined) {
              value = objectPool.parseValue.call(this);
            }
            return value;
          }
        }, {
          key: "parseKey",
          value: function parseKey() {
            // Base Profile : Key ------------------------
            var key = base.parseKey.call(this);
            // Object Pool Extension : Key ---------------
            if (key === undefined) {
              key = objectPool.parseKey.call(this);
            }
            return key;
          }
        }]);

        return Parser;
      })(AbstractParser);

      _export("Parser", Parser);

      /**
       * ParseError
       */

      ParseError = (function (_Error) {
        _inherits(ParseError, _Error);

        function ParseError(message, detail) {
          _classCallCheck(this, ParseError);

          _get(Object.getPrototypeOf(ParseError.prototype), "constructor", this).call(this, message);
          this.name = "ParseError";
          this.message = message || "Unknown error";
          this.detail = detail || {};
          if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ParseError);
          }
        }

        return ParseError;
      })(Error);

      _export("ParseError", ParseError);
    }
  };
});