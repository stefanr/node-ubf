/**
 * Universal Binary Format
 * @module ubf
 */
import {LEN} from "../info";
import * as MARKER from "../markers";

export function parseControlDirective(): ?boolean {
  switch (this._readMarker()) {
    case MARKER.CTRL_HEADER: {
      this._consume(LEN.MARKER);
      // TODO
      return true;
    }
  }
}

export function parseValue(): ?any {
  switch (this._readMarker()) {
    // Dict
    case MARKER.VAL_DICT1: {
      let length = this::parseLength(LEN.SIZE1, LEN.MARKER);
      if (length !== undefined) {
        return this::parseValueDict(length);
      }
      return;
    }
    case MARKER.VAL_DICT2: {
      let length = this::parseLength(LEN.SIZE2, LEN.MARKER);
      if (length !== undefined) {
        return this::parseValueDict(length);
      }
      return;
    }
    case MARKER.VAL_DICT4: {
      let length = this::parseLength(LEN.SIZE4, LEN.MARKER);
      if (length !== undefined) {
        return this::parseValueDict(length);
      }
      return;
    }

    // List
    case MARKER.VAL_LIST1: {
      let length = this::parseLength(LEN.SIZE1, LEN.MARKER);
      if (length !== undefined) {
        return this::parseValueList(length);
      }
      return;
    }
    case MARKER.VAL_LIST2: {
      let length = this::parseLength(LEN.SIZE2, LEN.MARKER);
      if (length !== undefined) {
        return this::parseValueList(length);
      }
      return;
    }
    case MARKER.VAL_LIST4: {
      let length = this::parseLength(LEN.SIZE4, LEN.MARKER);
      if (length !== undefined) {
        return this::parseValueList(length);
      }
      return;
    }

    // String
    case MARKER.VAL_STR1: {
      let length = this::parseLength(LEN.SIZE1, LEN.MARKER);
      if (length !== undefined) {
        return this._consumeString(length);
      }
      return;
    }
    case MARKER.VAL_STR2: {
      let length = this::parseLength(LEN.SIZE2, LEN.MARKER);
      if (length !== undefined) {
        return this._consumeString(length);
      }
      return;
    }
    case MARKER.VAL_STR4: {
      let length = this::parseLength(LEN.SIZE4, LEN.MARKER);
      if (length !== undefined) {
        return this._consumeString(length);
      }
      return;
    }

    // Binary
    case MARKER.VAL_BIN1: {
      let length = this::parseLength(LEN.SIZE1, LEN.MARKER);
      if (length !== undefined) {
        return this._consumeBinary(length);
      }
      return;
    }
    case MARKER.VAL_BIN2: {
      let length = this::parseLength(LEN.SIZE2, LEN.MARKER);
      if (length !== undefined) {
        return this._consumeBinary(length);
      }
      return;
    }
    case MARKER.VAL_BIN4: {
      let length = this::parseLength(LEN.SIZE4, LEN.MARKER);
      if (length !== undefined) {
        return this._consumeBinary(length);
      }
      return;
    }

    // Number
    case MARKER.VAL_INT8: {
      return this._consumeInt8(LEN.MARKER);
    }
    case MARKER.VAL_INT16: {
      return this._consumeInt16(LEN.MARKER);
    }
    case MARKER.VAL_INT32: {
      return this._consumeInt32(LEN.MARKER);
    }
    case MARKER.VAL_INT64: {
      return this._consumeInt64(LEN.MARKER);
    }

    case MARKER.VAL_FLOAT: {
      return this._consumeFloat(LEN.MARKER);
    }
    case MARKER.VAL_DOUBLE: {
      return this._consumeDouble(LEN.MARKER);
    }

    // Boolean
    case MARKER.VAL_FALSE: {
      return this._consume(LEN.MARKER, false);
    }
    case MARKER.VAL_TRUE: {
      return this._consume(LEN.MARKER, true);
    }

    // Null
    case MARKER.VAL_NULL: {
      return this._consume(LEN.MARKER, null);
    }
  }
}

export function parseKey(): ?string {
  switch (this._readMarker()) {
    case MARKER.KEY_STR1: {
      let length = this::parseLength(LEN.SIZE1, LEN.MARKER);
      if (length !== undefined) {
        return this._consumeString(length);
      }
      return;
    }
    case MARKER.KEY_STR2: {
      let length = this::parseLength(LEN.SIZE2, LEN.MARKER);
      if (length !== undefined) {
        return this._consumeString(length);
      }
      return;
    }
  }
}

export function parseLength(size: number, relOffset: number = 0): number {
  switch (size) {
    case LEN.SIZE1: {
      let length = this._consumeUInt8(relOffset);
      if (length === undefined) {
        return;
      }
      if (this._available(length)) {
        return length;
      }
      this._rewind(LEN.SIZE1 + relOffset);
      return;
    }
    case LEN.SIZE2: {
      let length = this._consumeUInt16(relOffset);
      if (length === undefined) {
        return;
      }
      if (this._available(length)) {
        return length;
      }
      this._rewind(LEN.SIZE2 + relOffset);
      return;
    }
    case LEN.SIZE4: {
      let length = this._consumeUInt32(relOffset);
      if (length === undefined) {
        return;
      }
      if (this._available(length)) {
        return length;
      }
      this._rewind(LEN.SIZE4 + relOffset);
      return;
    }
  }
}

export function parseValueDict(length: number): Object {
  let eoc = this.offset + length;
  let dict = {};
  while (this.offset < eoc && this.offset < this.buffer.length) {
    let key = this._parseKey();
    if (key === undefined) {
      break;
    }
    let value = this._parseValue();
    if (value === undefined) {
      break;
    }
    dict[key] = value;
  }
  this.offset = eoc;
  return dict;
}

export function parseValueList(length: number): Array {
  let eoc = this.offset + length;
  let list = [];
  while (this.offset < eoc && this.offset < this.buffer.length) {
    let value = this._parseValue();
    if (value === undefined) {
      break;
    }
    list.push(value);
  }
  this.offset = eoc;
  return list;
}
