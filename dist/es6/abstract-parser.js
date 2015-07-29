/*
 * Universal Binary Format
 * AbstractParser
 */
"use strict";

import { EventEmitter } from "yaee";
import Int64 from "node-int64";

/**
 * AbstractParser
 */

class AbstractParser extends EventEmitter {

  resetBuffer(buffer) {
    this.buffer = buffer || null;
    this.offset = 0;
  }

  readMarker(offset = this.offset) {
    return this.readUInt8(offset | 0) | 0;
  }

  available(length, relOffset = 0) {
    if (this.offset + relOffset + length > this.buffer.length) {
      this.truncated = true;
      return false;
    }
    return true;
  }

  // Read operations -------------------------------------------------

  readInt8(offset) {
    return +this.buffer.readInt8(offset | 0, true);
  }

  readUInt8(offset) {
    return +this.buffer.readUInt8(offset | 0, true);
  }

  readInt16(offset) {
    return +this.buffer.readInt16BE(offset | 0, true);
  }

  readUInt16(offset) {
    return +this.buffer.readUInt16BE(offset | 0, true);
  }

  readInt32(offset) {
    return +this.buffer.readInt32BE(offset | 0, true);
  }

  readUInt32(offset) {
    return +this.buffer.readUInt32BE(offset | 0, true);
  }

  readInt64(offset) {
    return +new Int64(this.buffer, offset | 0).toNumber(false);
  }

  readFloat(offset) {
    return +this.buffer.readFloatBE(offset | 0, true);
  }

  readDouble(offset) {
    return +this.buffer.readDoubleBE(offset | 0, true);
  }

  readString(offset, length) {
    return this.buffer.toString("utf8", offset | 0, offset + length | 0);
  }

  readBinary(offset, length) {
    return this.buffer.slice(offset | 0, offset + length | 0);
  }

  // Consume operations ----------------------------------------------

  consume(length, value) {
    this.offset += length | 0;
    return value;
  }

  rewind(length) {
    this.offset -= length | 0;
  }

  consumeInt8(relOffset = 0) {
    if (!this.available(1, relOffset)) {
      return;
    }
    return +this.consume(1 + relOffset, +this.readInt8(this.offset + relOffset));
  }

  consumeUInt8(relOffset = 0) {
    if (!this.available(1, relOffset)) {
      return;
    }
    return +this.consume(1 + relOffset, +this.readUInt8(this.offset + relOffset));
  }

  consumeInt16(relOffset = 0) {
    if (!this.available(2, relOffset)) {
      return;
    }
    return +this.consume(2 + relOffset, +this.readInt16(this.offset + relOffset));
  }

  consumeUInt16(relOffset = 0) {
    if (!this.available(2, relOffset)) {
      return;
    }
    return +this.consume(2 + relOffset, +this.readUInt16(this.offset + relOffset));
  }

  consumeInt32(relOffset = 0) {
    if (!this.available(4, relOffset)) {
      return;
    }
    return +this.consume(4 + relOffset, +this.readInt32(this.offset + relOffset));
  }

  consumeUInt32(relOffset = 0) {
    if (!this.available(4, relOffset)) {
      return;
    }
    return +this.consume(4 + relOffset, +this.readUInt32(this.offset + relOffset));
  }

  consumeInt64(relOffset = 0) {
    if (!this.available(8, relOffset)) {
      return;
    }
    return +this.consume(8 + relOffset, +this.readInt64(this.offset + relOffset));
  }

  consumeFloat(relOffset = 0) {
    if (!this.available(4, relOffset)) {
      return;
    }
    return +this.consume(4 + relOffset, +this.readFloat(this.offset + relOffset));
  }

  consumeDouble(relOffset = 0) {
    if (!this.available(8, relOffset)) {
      return;
    }
    return +this.consume(8 + relOffset, +this.readDouble(this.offset + relOffset));
  }

  consumeString(length, relOffset = 0) {
    if (!this.available(length, relOffset)) {
      return;
    }
    return this.consume(length + relOffset, this.readString(this.offset + relOffset, length));
  }

  consumeBinary(length, relOffset = 0) {
    if (!this.available(length, relOffset)) {
      return;
    }
    return this.consume(length + relOffset, this.readBinary(this.offset + relOffset, length));
  }
}

export { AbstractParser };