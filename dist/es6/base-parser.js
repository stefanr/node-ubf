/*
 * Universal Binary Format
 * Base Profile
 */
"use strict";

export { parseControlDirective };

export { parseValue };

export { parseKey };

export { parseLength };

export { parseValueContainerDict };

export { parseValueContainerList };
import * as MARKER from "./markers";

/**
 * Base Profile : Byte Lengths
 */
const LEN_OF_MARKER = 1;
export { LEN_OF_MARKER };
const LEN_OF_SIZE1 = 1;
export { LEN_OF_SIZE1 };
const LEN_OF_SIZE2 = 1 << 1;
export { LEN_OF_SIZE2 };
const LEN_OF_SIZE4 = 1 << 2;

export { LEN_OF_SIZE4 };
/**
 * Base Profile : parseControlDirective
 */
function parseControlDirective() {
  switch (this.readMarker()) {
    case MARKER.CTRL_HEADER:
      {
        this.consume(LEN_OF_MARKER);
        return true;
      }
  }
}

/**
 * Base Profile : parseValue
 */
function parseValue() {
  switch (this.readMarker()) {
    // Container : Dict ------------------------
    case MARKER.VAL_DICT1:
      {
        let length = parseLength.call(this, LEN_OF_SIZE1, LEN_OF_MARKER);
        if (length === undefined) {
          return;
        }
        return parseValueContainerDict.call(this, length);
      }
    case MARKER.VAL_DICT2:
      {
        let length = parseLength.call(this, LEN_OF_SIZE2, LEN_OF_MARKER);
        if (length === undefined) {
          return;
        }
        return parseValueContainerDict.call(this, length);
      }
    case MARKER.VAL_DICT4:
      {
        let length = parseLength.call(this, LEN_OF_SIZE4, LEN_OF_MARKER);
        if (length === undefined) {
          return;
        }
        return parseValueContainerDict.call(this, length);
      }

    // Container : List ------------------------
    case MARKER.VAL_LIST1:
      {
        let length = parseLength.call(this, LEN_OF_SIZE1, LEN_OF_MARKER);
        if (length === undefined) {
          return;
        }
        return parseValueContainerList.call(this, length);
      }
    case MARKER.VAL_LIST2:
      {
        let length = parseLength.call(this, LEN_OF_SIZE2, LEN_OF_MARKER);
        if (length === undefined) {
          return;
        }
        return parseValueContainerList.call(this, length);
      }
    case MARKER.VAL_LIST4:
      {
        let length = parseLength.call(this, LEN_OF_SIZE4, LEN_OF_MARKER);
        if (length === undefined) {
          return;
        }
        return parseValueContainerList.call(this, length);
      }

    // Data : String ---------------------------
    case MARKER.VAL_STR1:
      {
        let length = parseLength.call(this, LEN_OF_SIZE1, LEN_OF_MARKER);
        if (length === undefined) {
          return;
        }
        return this.consumeString(length);
      }
    case MARKER.VAL_STR2:
      {
        let length = parseLength.call(this, LEN_OF_SIZE2, LEN_OF_MARKER);
        if (length === undefined) {
          return;
        }
        return this.consumeString(length);
      }
    case MARKER.VAL_STR4:
      {
        let length = parseLength.call(this, LEN_OF_SIZE4, LEN_OF_MARKER);
        if (length === undefined) {
          return;
        }
        return this.consumeString(length);
      }

    // Data : Binary ---------------------------
    case MARKER.VAL_BIN1:
      {
        let length = parseLength.call(this, LEN_OF_SIZE1, LEN_OF_MARKER);
        if (length === undefined) {
          return;
        }
        return this.consumeBinary(length);
      }
    case MARKER.VAL_BIN2:
      {
        let length = parseLength.call(this, LEN_OF_SIZE2, LEN_OF_MARKER);
        if (length === undefined) {
          return;
        }
        return this.consumeBinary(length);
      }
    case MARKER.VAL_BIN4:
      {
        let length = parseLength.call(this, LEN_OF_SIZE4, LEN_OF_MARKER);
        if (length === undefined) {
          return;
        }
        return this.consumeBinary(length);
      }

    // Primitive : Number ----------------------
    case MARKER.VAL_INT8:
      {
        return this.consumeInt8(LEN_OF_MARKER);
      }
    case MARKER.VAL_INT16:
      {
        return this.consumeInt16(LEN_OF_MARKER);
      }
    case MARKER.VAL_INT32:
      {
        return this.consumeInt32(LEN_OF_MARKER);
      }
    case MARKER.VAL_INT64:
      {
        return this.consumeInt64(LEN_OF_MARKER);
      }

    case MARKER.VAL_FLOAT:
      {
        return this.consumeFloat(LEN_OF_MARKER);
      }
    case MARKER.VAL_DOUBLE:
      {
        return this.consumeDouble(LEN_OF_MARKER);
      }

    // Primitive : Null ------------------------
    case MARKER.VAL_NULL:
      {
        return this.consume(LEN_OF_MARKER, null);
      }

    // Primitive : Boolean ---------------------
    case MARKER.VAL_FALSE:
      {
        return this.consume(LEN_OF_MARKER, false);
      }
    case MARKER.VAL_TRUE:
      {
        return this.consume(LEN_OF_MARKER, true);
      }
  }
}

/**
 * Base Profile : parseKey
 */
function parseKey() {
  switch (this.readMarker()) {
    // Key -------------------------------------
    case MARKER.KEY_STR1:
      {
        let length = parseLength.call(this, LEN_OF_SIZE1, LEN_OF_MARKER);
        if (length === undefined) {
          return;
        }
        return this.consumeString(length);
      }
    case MARKER.KEY_STR2:
      {
        let length = parseLength.call(this, LEN_OF_SIZE2, LEN_OF_MARKER);
        if (length === undefined) {
          return;
        }
        return this.consumeString(length);
      }
  }
}

/**
 * Base Profile : parseLength
 */
function parseLength(size, relOffset = 0) {
  switch (size) {
    case LEN_OF_SIZE1:
      {
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
    case LEN_OF_SIZE2:
      {
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
    case LEN_OF_SIZE4:
      {
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
 * Base Profile : parseValueContainerDict
 */
function parseValueContainerDict(length) {
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
 * Base Profile : parseValueContainerList
 */
function parseValueContainerList(length) {
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