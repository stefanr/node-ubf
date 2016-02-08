/**
 * Universal Binary Format
 * @module ubf
 */
import * as MARKER from "./markers";

export const LEN_OF_MARKER = 1;

export const LEN_OF_SIZE1 = 1;
export const LEN_OF_SIZE2 = 2;
export const LEN_OF_SIZE4 = 4;

/**
 * ControlDirective
 */
export function parseControlDirective(): boolean {
  switch (this.readMarker()) {
    case MARKER.CTRL_HEADER: {
      this.consume(LEN_OF_MARKER);
      // TODO
      return true;
    }
  }
}

/**
 * Value
 */
export function parseValue(): any {
  switch (this.readMarker()) {
    // Dict
    case MARKER.VAL_DICT1: {
      let length = this::parseLength(LEN_OF_SIZE1, LEN_OF_MARKER);
      if (length === undefined) {
        return;
      }
      return this::parseValueDict(length);
    }
    case MARKER.VAL_DICT2: {
      let length = this::parseLength(LEN_OF_SIZE2, LEN_OF_MARKER);
      if (length === undefined) {
        return;
      }
      return this::parseValueDict(length);
    }
    case MARKER.VAL_DICT4: {
      let length = this::parseLength(LEN_OF_SIZE4, LEN_OF_MARKER);
      if (length === undefined) {
        return;
      }
      return this::parseValueDict(length);
    }

    // List
    case MARKER.VAL_LIST1: {
      let length = this::parseLength(LEN_OF_SIZE1, LEN_OF_MARKER);
      if (length === undefined) {
        return;
      }
      return this::parseValueList(length);
    }
    case MARKER.VAL_LIST2: {
      let length = this::parseLength(LEN_OF_SIZE2, LEN_OF_MARKER);
      if (length === undefined) {
        return;
      }
      return this::parseValueList(length);
    }
    case MARKER.VAL_LIST4: {
      let length = this::parseLength(LEN_OF_SIZE4, LEN_OF_MARKER);
      if (length === undefined) {
        return;
      }
      return this::parseValueList(length);
    }

    // String
    case MARKER.VAL_STR1: {
      let length = this::parseLength(LEN_OF_SIZE1, LEN_OF_MARKER);
      if (length === undefined) {
        return;
      }
      return this.consumeString(length);
    }
    case MARKER.VAL_STR2: {
      let length = this::parseLength(LEN_OF_SIZE2, LEN_OF_MARKER);
      if (length === undefined) {
        return;
      }
      return this.consumeString(length);
    }
    case MARKER.VAL_STR4: {
      let length = this::parseLength(LEN_OF_SIZE4, LEN_OF_MARKER);
      if (length === undefined) {
        return;
      }
      return this.consumeString(length);
    }

    // Binary
    case MARKER.VAL_BIN1: {
      let length = this::parseLength(LEN_OF_SIZE1, LEN_OF_MARKER);
      if (length === undefined) {
        return;
      }
      return this.consumeBinary(length);
    }
    case MARKER.VAL_BIN2: {
      let length = this::parseLength(LEN_OF_SIZE2, LEN_OF_MARKER);
      if (length === undefined) {
        return;
      }
      return this.consumeBinary(length);
    }
    case MARKER.VAL_BIN4: {
      let length = this::parseLength(LEN_OF_SIZE4, LEN_OF_MARKER);
      if (length === undefined) {
        return;
      }
      return this.consumeBinary(length);
    }

    // Number
    case MARKER.VAL_INT8: {
      return this.consumeInt8(LEN_OF_MARKER);
    }
    case MARKER.VAL_INT16: {
      return this.consumeInt16(LEN_OF_MARKER);
    }
    case MARKER.VAL_INT32: {
      return this.consumeInt32(LEN_OF_MARKER);
    }
    case MARKER.VAL_INT64: {
      return this.consumeInt64(LEN_OF_MARKER);
    }

    case MARKER.VAL_FLOAT: {
      return this.consumeFloat(LEN_OF_MARKER);
    }
    case MARKER.VAL_DOUBLE: {
      return this.consumeDouble(LEN_OF_MARKER);
    }

    // Boolean
    case MARKER.VAL_FALSE: {
      return this.consume(LEN_OF_MARKER, false);
    }
    case MARKER.VAL_TRUE: {
      return this.consume(LEN_OF_MARKER, true);
    }

    // Null
    case MARKER.VAL_NULL: {
      return this.consume(LEN_OF_MARKER, null);
    }
  }
}

/**
 * Key
 */
export function parseKey(): string {
  switch (this.readMarker()) {
    case MARKER.KEY_STR1: {
      let length = this::parseLength(LEN_OF_SIZE1, LEN_OF_MARKER);
      if (length === undefined) {
        return;
      }
      return this.consumeString(length);
    }
    case MARKER.KEY_STR2: {
      let length = this::parseLength(LEN_OF_SIZE2, LEN_OF_MARKER);
      if (length === undefined) {
        return;
      }
      return this.consumeString(length);
    }
  }
}

/**
 * Length
 */
export function parseLength(size: number, relOffset: number = 0): number {
  switch (size) {
    case LEN_OF_SIZE1: {
      let length = this.consumeUInt8(relOffset);
      if (length === undefined) {
        return;
      }
      if (this.available(length)) {
        return length;
      }
      this.rewind(LEN_OF_SIZE1 + relOffset);
      return;
    }
    case LEN_OF_SIZE2: {
      let length = this.consumeUInt16(relOffset);
      if (length === undefined) {
        return;
      }
      if (this.available(length)) {
        return length;
      }
      this.rewind(LEN_OF_SIZE2 + relOffset);
      return;
    }
    case LEN_OF_SIZE4: {
      let length = this.consumeUInt32(relOffset);
      if (length === undefined) {
        return;
      }
      if (this.available(length)) {
        return length;
      }
      this.rewind(LEN_OF_SIZE4 + relOffset);
      return;
    }
  }
}

/**
 * Value : Dict
 */
export function parseValueDict(length: number): Object {
  let eoc = this.offset + length;
  let dict = Object.create(null);
  while (this.offset < eoc && this.offset < this.buffer.length) {
    let key = this.parseKey();
    if (key === undefined) {
      break;
    }
    let value = this.parseValue();
    if (value === undefined) {
      break;
    }
    dict[key] = value;
  }
  this.offset = eoc;
  return dict;
}

/**
 * Value : List
 */
export function parseValueList(length: number): Array {
  let eoc = this.offset + length;
  let list = [];
  while (this.offset < eoc && this.offset < this.buffer.length) {
    let value = this.parseValue();
    if (value === undefined) {
      break;
    }
    list.push(value);
  }
  this.offset = eoc;
  return list;
}
