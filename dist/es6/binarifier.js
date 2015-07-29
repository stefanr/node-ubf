/*
 * Universal Binary Format
 * Binarifier
 */
"use strict";

import { EventEmitter } from "yaee";
import Int64 from "node-int64";
import * as MARKER from "./markers";

/**
 * Byte Length
 */
const LEN_OF_MARKER = 1;

export { LEN_OF_MARKER };
/**
 * Binarifier
 */

class Binarifier extends EventEmitter {

  constructor(context) {
    super();
    this.context = context;
  }

  binarify(obj) {
    let info = this.byteLengthInfo(obj);
    let buf = new Buffer(info.len);
    this.writeValue(buf, 0, obj, info.len - info.pre);
    return buf;
  }

  writeValue(buf, offset, obj, len) {
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

  writeValueDict(buf, offset, dict, len) {
    if (len === undefined) {
      let info = this.byteLengthInfo(dict);
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
    let props = Object.getOwnPropertyNames(dict);
    for (let i = 0; i < props.length; i++) {
      let key = props[i];
      let val = dict[key];
      offset = this.writeKey(buf, offset, key);
      offset = this.writeValue(buf, offset, val);
    }
    return offset;
  }

  writeKey(buf, offset, key, len) {
    if (len === undefined) {
      len = this.byteLengthValueString(key);
    }
    if (len < 0xFF) {
      offset = buf.writeUInt8(MARKER.KEY_STR1, offset);
    } else {
      offset = buf.writeUInt8(MARKER.KEY_STR2, offset);
    }
    return this.writeString(buf, offset, key, Math.min(len, 0xFFFE));
  }

  writeValueList(buf, offset, list, len) {
    if (len === undefined) {
      let info = this.byteLengthInfo(list);
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
    for (let i = 0; i < list.length; i++) {
      offset = this.writeValue(buf, offset, list[i]);
    }
    return offset;
  }

  writeValueString(buf, offset, str, len) {
    if (len === undefined) {
      len = this.byteLengthValueString(str);
    }
    if (len < 0xFF) {
      offset = buf.writeUInt8(MARKER.VAL_STR1, offset);
    } else if (len < 0xFFFF) {
      offset = buf.writeUInt8(MARKER.VAL_STR2, offset);
    } else {
      offset = buf.writeUInt8(MARKER.VAL_STR4, offset);
    }
    return this.writeString(buf, offset, str, len);
  }

  writeValueNumber(buf, offset, num, len) {
    if (this.numberIsInteger(num)) {
      if (len === undefined) {
        len = this.byteLengthValueInteger(num);
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
        offset = new Int64(num).toBuffer().copy(buf, offset);
      }
    } else {
      offset = buf.writeUInt8(MARKER.VAL_DOUBLE, offset);
      offset = buf.writeDoubleBE(num, offset);
    }
    return offset;
  }

  writeValueNull(buf, offset) {
    return buf.writeUInt8(MARKER.VAL_NULL, offset);
  }

  writeValueBoolean(buf, offset, bool) {
    return buf.writeUInt8(bool ? MARKER.VAL_TRUE : VAL_FALSE, offset);
  }

  writeString(buf, offset, str, len) {
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

  // Byte length -----------------------------------------------------

  byteLengthInfo(obj) {
    let stack = [];
    let root = { len: 0, pre: 0 };
    this.pushToLengthCountStack(stack, obj, root);
    while (stack.length) {
      let cur = stack[stack.length - 1];
      cur.pre = LEN_OF_MARKER;
      if (cur.props && cur.props.length) {
        let key = cur.props.shift();
        let val = cur.obj[key];
        this.pushToLengthCountStack(stack, val, cur, key);
        continue;
      } else if (cur.idx > -1 && cur.idx < cur.obj.length) {
        let val = cur.obj[cur.idx++];
        this.pushToLengthCountStack(stack, val !== undefined ? val : null, cur);
        continue;
      }
      if (cur.key) {
        let l = this.byteLengthValueString(cur.key);
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

  byteLengthValueString(str) {
    let len = 0;
    for (let i = 0; i < str.length; i++) {
      let c = str.charCodeAt(i);
      len += c < 0x80 ? 1 : c < 0x0800 ? 2 : c < 0xD800 || c > 0xDFFF ? 3 : 2;
    }
    return len;
  }

  byteLengthValueNumber(num) {
    if (this.numberIsInteger(num)) {
      return this.byteLengthValueInteger(num);
    }
    return 8;
  }

  byteLengthValueInteger(num) {
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

  pushToLengthCountStack(stack, val, parent, key) {
    if (val !== undefined) {
      let obj = { obj: val, len: 0, parent: parent };
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

  numberIsInteger(num) {
    return num === (num | 0) || num === Math.floor(num);
  }
}

export { Binarifier };