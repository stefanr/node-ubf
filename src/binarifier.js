/**
 * Universal Binary Format
 * @module ubf
 */
import Int64 from "node-int64";
import {LEN} from "./info";
import * as MARKER from "./markers";
import * as __ctxt from "./binarifier/context";

export const {BinarifierContext} = __ctxt;

export class Binarifier {

  context: BinarifierContext;
  options = {};

  constructor(context?: BinarifierContext, options? = {}) {
    this.context = context || new BinarifierContext();
    Object.assign(this.options, options);
  }

  binarify(obj: any): Buffer {
    let info = this.byteLengthInfo(obj);
    let buf = new Buffer(info.len);
    this._writeValue(buf, 0, obj, info.len - info.pre);
    return buf;
  }

  // Write Operations ------------------------------------------------

  _writeValue(buf: Buffer, offset: number, obj: any, len?: number): number {
    switch (typeof obj) {
      // Dict, List, Null
      case "object": {
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
      case "string": {
        return this._writeValueString(buf, offset, obj, len);
      }
      // Number
      case "number": {
        return this._writeValueNumber(buf, offset, obj, len);
      }
      // Boolean
      case "boolean": {
        return this._writeValueBoolean(buf, offset, obj);
      }
    }
  }

  _writeValueDict(buf: Buffer, offset: number, dict: Object, len?: number): number {
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
      offset = this._writeKey(buf, offset, key);
      offset = this._writeValue(buf, offset, val);
    }
    return offset;
  }

  _writeKey(buf: Buffer, offset: number, key: string, len?: number): number {
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

  _writeValueList(buf: Buffer, offset: number, list: Array, len?: number): number {
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
      offset = this._writeValue(buf, offset, list[i]);
    }
    return offset;
  }

  _writeValueString(buf: Buffer, offset: number, str: string, len?: number): number {
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

  _writeValueNumber(buf: Buffer, offset: number, num: number, len?: number): number {
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
        offset = (new Int64(num)).toBuffer().copy(buf, offset);
      }
    } else {
      offset = buf.writeUInt8(MARKER.VAL_DOUBLE, offset);
      offset = buf.writeDoubleBE(num, offset);
    }
    return offset;
  }

  _writeValueNull(buf: Buffer, offset: number): number {
    return buf.writeUInt8(MARKER.VAL_NULL, offset);
  }

  _writeValueBoolean(buf: Buffer, offset: number, bool: boolean): number {
    return buf.writeUInt8(bool ? MARKER.VAL_TRUE : MARKER.VAL_FALSE, offset);
  }

  _writeString(buf: Buffer, offset: number, str: string, len?: number): number {
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

  byteLengthInfo(obj: any): Object {
    let stack = [];
    let root = { len: 0, pre: 0 };
    this._pushToLengthCountStack(stack, obj, root);
    while (stack.length) {
      let cur = stack[stack.length - 1];
      cur.pre = LEN.MARKER;
      if (cur.props && cur.props.length) {
        let key = cur.props.shift();
        let val = cur.obj[key];
        this._pushToLengthCountStack(stack, val, cur, key);
        continue;
      } else if (cur.idx > -1 && cur.idx < cur.obj.length) {
        let val = cur.obj[cur.idx++];
        this._pushToLengthCountStack(stack, val !== undefined ? val : null, cur);
        continue;
      }
      if (cur.key) {
        let l = this._byteLengthValueString(cur.key);
        cur.parent.len += LEN.MARKER;
        cur.parent.len += l < 0xFF ? 1 : 2;
        cur.parent.len += l;
      }
      switch (typeof cur.obj) {
        // Dict, List, Null
        case "object": {
          // Null
          if (cur.obj === null) {
            break;
          }
          // Dict, List
          cur.pre += cur.len < 0xFF ? 1 : (cur.len < 0xFFFF ? 2 : 4);
          break;
        }
        // String
        case "string": {
          cur.len = this._byteLengthValueString(cur.obj);
          cur.pre += cur.len < 0xFF ? 1 : (cur.len < 0xFFFF ? 2 : 4);
          break;
        }
        // Number
        case "number": {
          cur.len = this._byteLengthValueNumber(cur.obj);
          break;
        }
        // Boolean
        case "boolean": {
          break;
        }
      }
      cur.parent.len += cur.len += cur.pre;
      cur.parent.pre = cur.pre;
      stack.pop();
    }
    return root;
  }

  _byteLengthValueString(s: string): number {
    let len = 0;
    for (let i = 0; i < s.length; i++) {
      let c = s.charCodeAt(i);
      len += c < 0x80 ? 1 : (c < 0x0800 ? 2 : (c < 0xD800 || c > 0xDFFF ? 3 : 2));
    }
    return len;
  }

  _byteLengthValueNumber(n: number): number {
    if (Number.isInteger(n)) {
      return this._byteLengthValueInteger(n);
    }
    return 8;
  }

  _byteLengthValueInteger(n: number): number {
    if (n < 0) {
      return -0x80 <= n ? 1 : (-0x8000 <= n ? 2 : (-0x80000000 <= n ? 4 : 8));
    }
    return n <= 0x7F ? 1 : (n <= 0x7FFF ? 2 : (n <= 0x7FFFFFFF ? 4 : 8));
  }

  _pushToLengthCountStack(stack: Array, val: any, parent: Object, key: string): void {
    if (val !== undefined) {
      let obj = { obj: val, len: 0, parent };
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
}
