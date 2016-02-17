"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Universal Binary Format
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @module ubf
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Binarifier = exports.BinarifierContext = undefined;

var _nodeInt = require("node-int64");

var _nodeInt2 = _interopRequireDefault(_nodeInt);

var _info = require("./info");

var _markers = require("./markers");

var MARKER = _interopRequireWildcard(_markers);

var _context = require("./binarifier/context");

var __ctxt = _interopRequireWildcard(_context);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BinarifierContext = __ctxt.BinarifierContext;
exports.BinarifierContext = BinarifierContext;

var Binarifier = exports.Binarifier = function () {
  function Binarifier(context) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, Binarifier);

    this.options = {};

    this.context = context || new BinarifierContext();
    _extends(this.options, options);
  }

  _createClass(Binarifier, [{
    key: "binarify",
    value: function binarify(obj) {
      var info = this.byteLengthInfo(obj);
      var buf = new Buffer(info.len);
      this._writeValue(buf, 0, obj, info.len - info.pre);
      return buf;
    }

    // Write Operations ------------------------------------------------

  }, {
    key: "_writeValue",
    value: function _writeValue(buf, offset, obj, len) {
      switch (typeof obj === "undefined" ? "undefined" : _typeof(obj)) {
        // Dict, List, Null
        case "object":
          {
            // Null
            if (obj === null) {
              return this._writeValueNull(buf, offset);
            }
            // List
            if (Array.isArray(obj)) {
              return this._writeValueList(buf, offset, obj, len);
            }
            // Dict
            return this._writeValueDict(buf, offset, obj, len);
          }
        // String
        case "string":
          {
            return this._writeValueString(buf, offset, obj, len);
          }
        // Number
        case "number":
          {
            return this._writeValueNumber(buf, offset, obj, len);
          }
        // Boolean
        case "boolean":
          {
            return this._writeValueBoolean(buf, offset, obj);
          }
      }
    }
  }, {
    key: "_writeValueDict",
    value: function _writeValueDict(buf, offset, dict, len) {
      if (len === undefined) {
        var info = this.byteLengthInfo(dict);
        len = info.len - info.pre;
      }
      if (len < 0xFF) {
        offset = buf.writeUInt8(MARKER.VAL_DICT1, offset);
        offset = buf.writeUInt8(len, offset);
      } else if (len < 0xFFFF) {
        offset = buf.writeUInt8(MARKER.VAL_DICT2, offset);
        offset = buf.writeUInt16BE(len, offset);
      } else {
        offset = buf.writeUInt8(MARKER.VAL_DICT4, offset);
        offset = buf.writeUInt32BE(len, offset);
      }
      var props = Object.getOwnPropertyNames(dict);
      for (var i = 0; i < props.length; i++) {
        var key = props[i];
        var val = dict[key];
        offset = this._writeKey(buf, offset, key);
        offset = this._writeValue(buf, offset, val);
      }
      return offset;
    }
  }, {
    key: "_writeKey",
    value: function _writeKey(buf, offset, key, len) {
      if (len === undefined) {
        len = this._byteLengthValueString(key);
      }
      if (len < 0xFF) {
        offset = buf.writeUInt8(MARKER.KEY_STR1, offset);
      } else {
        offset = buf.writeUInt8(MARKER.KEY_STR2, offset);
      }
      return this._writeString(buf, offset, key, Math.min(len, 0xFFFE));
    }
  }, {
    key: "_writeValueList",
    value: function _writeValueList(buf, offset, list, len) {
      if (len === undefined) {
        var info = this.byteLengthInfo(list);
        len = info.len - info.pre;
      }
      if (len < 0xFF) {
        offset = buf.writeUInt8(MARKER.VAL_LIST1, offset);
        offset = buf.writeUInt8(len, offset);
      } else if (len < 0xFFFF) {
        offset = buf.writeUInt8(MARKER.VAL_LIST2, offset);
        offset = buf.writeUInt16BE(len, offset);
      } else {
        offset = buf.writeUInt8(MARKER.VAL_LIST4, offset);
        offset = buf.writeUInt32BE(len, offset);
      }
      for (var i = 0; i < list.length; i++) {
        offset = this._writeValue(buf, offset, list[i]);
      }
      return offset;
    }
  }, {
    key: "_writeValueString",
    value: function _writeValueString(buf, offset, str, len) {
      if (len === undefined) {
        len = this._byteLengthValueString(str);
      }
      if (len < 0xFF) {
        offset = buf.writeUInt8(MARKER.VAL_STR1, offset);
      } else if (len < 0xFFFF) {
        offset = buf.writeUInt8(MARKER.VAL_STR2, offset);
      } else {
        offset = buf.writeUInt8(MARKER.VAL_STR4, offset);
      }
      return this._writeString(buf, offset, str, len);
    }
  }, {
    key: "_writeValueNumber",
    value: function _writeValueNumber(buf, offset, num, len) {
      if (Number.isInteger(num)) {
        if (len === undefined) {
          len = this._byteLengthValueInteger(num);
        }
        if (len === 1) {
          offset = buf.writeUInt8(MARKER.VAL_INT8, offset);
          offset = buf.writeInt8(num, offset);
        } else if (len === 2) {
          offset = buf.writeUInt8(MARKER.VAL_INT16, offset);
          offset = buf.writeInt16BE(num, offset);
        } else if (len === 4) {
          offset = buf.writeUInt8(MARKER.VAL_INT32, offset);
          offset = buf.writeInt32BE(num, offset);
        } else {
          offset = buf.writeUInt8(MARKER.VAL_INT64, offset);
          offset = new _nodeInt2.default(num).toBuffer().copy(buf, offset);
        }
      } else {
        offset = buf.writeUInt8(MARKER.VAL_DOUBLE, offset);
        offset = buf.writeDoubleBE(num, offset);
      }
      return offset;
    }
  }, {
    key: "_writeValueNull",
    value: function _writeValueNull(buf, offset) {
      return buf.writeUInt8(MARKER.VAL_NULL, offset);
    }
  }, {
    key: "_writeValueBoolean",
    value: function _writeValueBoolean(buf, offset, bool) {
      return buf.writeUInt8(bool ? MARKER.VAL_TRUE : MARKER.VAL_FALSE, offset);
    }
  }, {
    key: "_writeString",
    value: function _writeString(buf, offset, str, len) {
      if (len === undefined) {
        len = this._byteLengthValueString(str);
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

    // Byte Length -----------------------------------------------------

  }, {
    key: "byteLengthInfo",
    value: function byteLengthInfo(obj) {
      var stack = [];
      var root = { len: 0, pre: 0 };
      this._pushToLengthCountStack(stack, obj, root);
      while (stack.length) {
        var cur = stack[stack.length - 1];
        cur.pre = _info.LEN.MARKER;
        if (cur.props && cur.props.length) {
          var key = cur.props.shift();
          var val = cur.obj[key];
          this._pushToLengthCountStack(stack, val, cur, key);
          continue;
        } else if (cur.idx > -1 && cur.idx < cur.obj.length) {
          var val = cur.obj[cur.idx++];
          this._pushToLengthCountStack(stack, val !== undefined ? val : null, cur);
          continue;
        }
        if (cur.key) {
          var l = this._byteLengthValueString(cur.key);
          cur.parent.len += _info.LEN.MARKER;
          cur.parent.len += l < 0xFF ? 1 : 2;
          cur.parent.len += l;
        }
        switch (_typeof(cur.obj)) {
          // Dict, List, Null
          case "object":
            {
              // Null
              if (cur.obj === null) {
                break;
              }
              // Dict, List
              cur.pre += cur.len < 0xFF ? 1 : cur.len < 0xFFFF ? 2 : 4;
              break;
            }
          // String
          case "string":
            {
              cur.len = this._byteLengthValueString(cur.obj);
              cur.pre += cur.len < 0xFF ? 1 : cur.len < 0xFFFF ? 2 : 4;
              break;
            }
          // Number
          case "number":
            {
              cur.len = this._byteLengthValueNumber(cur.obj);
              break;
            }
          // Boolean
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
    key: "_byteLengthValueString",
    value: function _byteLengthValueString(s) {
      var len = 0;
      for (var i = 0; i < s.length; i++) {
        var c = s.charCodeAt(i);
        len += c < 0x80 ? 1 : c < 0x0800 ? 2 : c < 0xD800 || c > 0xDFFF ? 3 : 2;
      }
      return len;
    }
  }, {
    key: "_byteLengthValueNumber",
    value: function _byteLengthValueNumber(n) {
      if (Number.isInteger(n)) {
        return this._byteLengthValueInteger(n);
      }
      return 8;
    }
  }, {
    key: "_byteLengthValueInteger",
    value: function _byteLengthValueInteger(n) {
      if (n < 0) {
        return -0x80 <= n ? 1 : -0x8000 <= n ? 2 : -0x80000000 <= n ? 4 : 8;
      }
      return n <= 0x7F ? 1 : n <= 0x7FFF ? 2 : n <= 0x7FFFFFFF ? 4 : 8;
    }
  }, {
    key: "_pushToLengthCountStack",
    value: function _pushToLengthCountStack(stack, val, parent, key) {
      if (val !== undefined) {
        var obj = { obj: val, len: 0, parent: parent };
        if (key) {
          obj.key = key;
        }
        if ((typeof val === "undefined" ? "undefined" : _typeof(val)) === "object" && val !== null) {
          if (Array.isArray(val)) {
            obj.idx = 0;
          } else {
            obj.props = Object.getOwnPropertyNames(val);
          }
        }
        stack.push(obj);
      }
    }
  }]);

  return Binarifier;
}();