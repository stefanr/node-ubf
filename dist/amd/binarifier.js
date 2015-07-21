define(["exports", "yaee", "node-int64", "./markers"], function (exports, _yaee, _nodeInt64, _markers) {
  /*
   * Universal Binary Format
   * Binarifier
   */
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

  var _Int64 = _interopRequireDefault(_nodeInt64);

  /**
   * Byte Length
   */
  var LEN_OF_MARKER = 1;

  exports.LEN_OF_MARKER = LEN_OF_MARKER;
  /**
   * Binarifier
   */

  var Binarifier = (function (_EventEmitter) {
    _inherits(Binarifier, _EventEmitter);

    function Binarifier(context) {
      _classCallCheck(this, Binarifier);

      _get(Object.getPrototypeOf(Binarifier.prototype), "constructor", this).call(this);
      this.context = context;
    }

    _createClass(Binarifier, [{
      key: "binarify",
      value: function binarify(obj) {
        var info = this.byteLengthInfo(obj);
        var buf = new Buffer(info.len);
        this.writeValue(buf, 0, obj, info.len - info.pre);
        return buf;
      }
    }, {
      key: "writeValue",
      value: function writeValue(buf, offset, obj, len) {
        switch (typeof obj) {
          // Dict, List, Null ------------------------
          case "object":
            {
              // Null ------------------------
              if (obj === null) {
                return this.writeValueNull(buf, offset);
              }
              // List ------------------------
              if (Array.isArray(obj)) {
                return this.writeValueList(buf, offset, obj, len);
              }
              // Dict ------------------------
              return this.writeValueDict(buf, offset, obj, len);
            }
          // String ----------------------------------
          case "string":
            {
              return this.writeValueString(buf, offset, obj, len);
            }
          // Number ----------------------------------
          case "number":
            {
              return this.writeValueNumber(buf, offset, obj, len);
            }
          // Boolean ---------------------------------
          case "boolean":
            {
              return this.writeValueBoolean(buf, offset, obj);
            }
        }
      }
    }, {
      key: "writeValueDict",
      value: function writeValueDict(buf, offset, dict, len) {
        if (len === undefined) {
          var info = this.byteLengthInfo(dict);
          len = info.len - info.pre;
        }
        if (len < 0xFF) {
          offset = buf.writeUInt8(_markers.VAL_DICT1, offset);
          offset = buf.writeUInt8(len, offset);
        } else if (len < 0xFFFF) {
          offset = buf.writeUInt8(_markers.VAL_DICT2, offset);
          offset = buf.writeUInt16BE(len, offset);
        } else {
          offset = buf.writeUInt8(_markers.VAL_DICT4, offset);
          offset = buf.writeUInt32BE(len, offset);
        }
        var props = Object.getOwnPropertyNames(dict);
        for (var i = 0; i < props.length; i++) {
          var key = props[i];
          var val = dict[key];
          offset = this.writeKey(buf, offset, key);
          offset = this.writeValue(buf, offset, val);
        }
        return offset;
      }
    }, {
      key: "writeKey",
      value: function writeKey(buf, offset, key, len) {
        if (len === undefined) {
          len = this.byteLengthValueString(key);
        }
        if (len < 0xFF) {
          offset = buf.writeUInt8(_markers.KEY_STR1, offset);
        } else {
          offset = buf.writeUInt8(_markers.KEY_STR2, offset);
        }
        return this.writeString(buf, offset, key, Math.min(len, 0xFFFE));
      }
    }, {
      key: "writeValueList",
      value: function writeValueList(buf, offset, list, len) {
        if (len === undefined) {
          var info = this.byteLengthInfo(list);
          len = info.len - info.pre;
        }
        if (len < 0xFF) {
          offset = buf.writeUInt8(_markers.VAL_LIST1, offset);
          offset = buf.writeUInt8(len, offset);
        } else if (len < 0xFFFF) {
          offset = buf.writeUInt8(_markers.VAL_LIST2, offset);
          offset = buf.writeUInt16BE(len, offset);
        } else {
          offset = buf.writeUInt8(_markers.VAL_LIST4, offset);
          offset = buf.writeUInt32BE(len, offset);
        }
        for (var i = 0; i < list.length; i++) {
          offset = this.writeValue(buf, offset, list[i]);
        }
        return offset;
      }
    }, {
      key: "writeValueString",
      value: function writeValueString(buf, offset, str, len) {
        if (len === undefined) {
          len = this.byteLengthValueString(str);
        }
        if (len < 0xFF) {
          offset = buf.writeUInt8(_markers.VAL_STR1, offset);
        } else if (len < 0xFFFF) {
          offset = buf.writeUInt8(_markers.VAL_STR2, offset);
        } else {
          offset = buf.writeUInt8(_markers.VAL_STR4, offset);
        }
        return this.writeString(buf, offset, str, len);
      }
    }, {
      key: "writeValueNumber",
      value: function writeValueNumber(buf, offset, num, len) {
        if (this.numberIsInteger(num)) {
          if (len === undefined) {
            len = this.byteLengthValueInteger(num);
          }
          if (len === 1) {
            offset = buf.writeUInt8(_markers.VAL_INT8, offset);
            offset = buf.writeInt8(num, offset);
          } else if (len === 2) {
            offset = buf.writeUInt8(_markers.VAL_INT16, offset);
            offset = buf.writeInt16BE(num, offset);
          } else if (len === 4) {
            offset = buf.writeUInt8(_markers.VAL_INT32, offset);
            offset = buf.writeInt32BE(num, offset);
          } else {
            offset = buf.writeUInt8(_markers.VAL_INT64, offset);
            offset = new _Int64["default"](num).toBuffer().copy(buf, offset);
          }
        } else {
          offset = buf.writeUInt8(_markers.VAL_DOUBLE, offset);
          offset = buf.writeDoubleBE(num, offset);
        }
        return offset;
      }
    }, {
      key: "writeValueNull",
      value: function writeValueNull(buf, offset) {
        return buf.writeUInt8(_markers.VAL_NULL, offset);
      }
    }, {
      key: "writeValueBoolean",
      value: function writeValueBoolean(buf, offset, bool) {
        return buf.writeUInt8(bool ? _markers.VAL_TRUE : VAL_FALSE, offset);
      }
    }, {
      key: "writeString",
      value: function writeString(buf, offset, str, len) {
        if (len === undefined) {
          len = this.byteLengthValueString(str);
        }
        if (len < 0xFF) {
          offset = buf.writeUInt8(len, offset);
        } else if (len < 0xFFFF) {
          offset = buf.writeUInt16BE(len, offset);
        } else {
          offset = buf.writeUInt32BE(len, offset);
        }
        return offset + buf.write(str, offset, len, "utf8");
      }
    }, {
      key: "byteLengthInfo",

      // Byte length -----------------------------------------------------

      value: function byteLengthInfo(obj) {
        var stack = [];
        var root = { len: 0, pre: 0 };
        this.pushToLengthCountStack(stack, obj, root);
        while (stack.length) {
          var cur = stack[stack.length - 1];
          cur.pre = LEN_OF_MARKER;
          if (cur.props && cur.props.length) {
            var key = cur.props.shift();
            var val = cur.obj[key];
            this.pushToLengthCountStack(stack, val, cur, key);
            continue;
          } else if (cur.idx > -1 && cur.idx < cur.obj.length) {
            var val = cur.obj[cur.idx++];
            this.pushToLengthCountStack(stack, val !== undefined ? val : null, cur);
            continue;
          }
          if (cur.key) {
            var l = this.byteLengthValueString(cur.key);
            cur.parent.len += LEN_OF_MARKER;
            cur.parent.len += l < 0xFF ? 1 : 2;
            cur.parent.len += l;
          }
          switch (typeof cur.obj) {
            // Dict, List, Null ----------------------
            case "object":
              {
                // Null ----------------------
                if (cur.obj === null) {
                  break;
                }
                // Dict, List ----------------------
                cur.pre += cur.len < 0xFF ? 1 : cur.len < 0xFFFF ? 2 : 4;
                break;
              }
            // String --------------------------------
            case "string":
              {
                cur.len = this.byteLengthValueString(cur.obj);
                cur.pre += cur.len < 0xFF ? 1 : cur.len < 0xFFFF ? 2 : 4;
                break;
              }
            // Number --------------------------------
            case "number":
              {
                cur.len = this.byteLengthValueNumber(cur.obj);
                break;
              }
            // Boolean -------------------------------
            case "boolean":
              {
                break;
              }
          }
          cur.parent.len += cur.len += cur.pre;
          cur.parent.pre = cur.pre;
          stack.pop();
        }
        return root;
      }
    }, {
      key: "byteLengthValueString",
      value: function byteLengthValueString(str) {
        var len = 0;
        for (var i = 0; i < str.length; i++) {
          var c = str.charCodeAt(i);
          len += c < 0x80 ? 1 : c < 0x0800 ? 2 : c < 0xD800 || c > 0xDFFF ? 3 : 2;
        }
        return len;
      }
    }, {
      key: "byteLengthValueNumber",
      value: function byteLengthValueNumber(num) {
        if (this.numberIsInteger(num)) {
          return this.byteLengthValueInteger(num);
        }
        return 8;
      }
    }, {
      key: "byteLengthValueInteger",
      value: function byteLengthValueInteger(num) {
        if (-0x80 <= num && num <= 0x7F) {
          return 1;
        }
        if (-0x8000 <= num && num <= 0x7FFF) {
          return 2;
        }
        if (-0x80000000 <= num && num <= 0x7FFFFFFF) {
          return 4;
        }
        return 8;
      }
    }, {
      key: "pushToLengthCountStack",
      value: function pushToLengthCountStack(stack, val, parent, key) {
        if (val !== undefined) {
          var obj = { obj: val, len: 0, parent: parent };
          if (key) {
            obj.key = key;
          }
          if (typeof val === "object" && val !== null) {
            if (Array.isArray(val)) {
              obj.idx = 0;
            } else {
              obj.props = Object.getOwnPropertyNames(val);
            }
          }
          stack.push(obj);
        }
      }
    }, {
      key: "numberIsInteger",
      value: function numberIsInteger(num) {
        return num === (num | 0) || num === Math.floor(num);
      }
    }]);

    return Binarifier;
  })(_yaee.EventEmitter);

  exports.Binarifier = Binarifier;
});