/**
 * Universal Binary Format
 * @module ubf
 */
import Int64 from "node-int64";

export class AbstractParser {

  buffer: Buffer;
  offset: number;

  _truncated: boolean;

  _resetBuffer(buffer: Buffer): void {
    this.buffer = buffer || null;
    this.offset = 0;
    this._truncated = false;
  }

  // Read Operations -------------------------------------------------

  _available(length: number, relOffset: number = 0): boolean {
    if (this.offset + relOffset + length > this.buffer.length) {
      this._truncated = true;
      return false;
    }
    return true;
  }

  _readMarker(offset: number = this.offset): ?number {
    if (this._available(1)) {
      return this._readUInt8(offset|0);
    }
  }

  _readInt8(offset: number): number {
    return +this.buffer.readInt8(offset|0, true);
  }

  _readUInt8(offset: number): number {
    return +this.buffer.readUInt8(offset|0, true);
  }

  _readInt16(offset: number): number {
    return +this.buffer.readInt16BE(offset|0, true);
  }

  _readUInt16(offset: number): number {
    return +this.buffer.readUInt16BE(offset|0, true);
  }

  _readInt32(offset: number): number {
    return +this.buffer.readInt32BE(offset|0, true);
  }

  _readUInt32(offset: number): number {
    return +this.buffer.readUInt32BE(offset|0, true);
  }

  _readInt64(offset: number): number {
    return +(new Int64(this.buffer, offset|0).toNumber(false));
  }

  _readFloat(offset: number): number {
    return +this.buffer.readFloatBE(offset|0, true);
  }

  _readDouble(offset: number): number {
    return +this.buffer.readDoubleBE(offset|0, true);
  }

  _readString(offset: number, length: number): string {
    return this.buffer.toString("utf8", offset|0, (offset + length)|0);
  }

  _readBinary(offset: number, length: number): Buffer {
    return this.buffer.slice(offset|0, (offset + length)|0);
  }

  // Consume Operations ----------------------------------------------

  _consume(length: number, value: any): any {
    this.offset += length|0;
    return value;
  }

  _rewind(length: number): void {
    this.offset -= length|0;
  }

  _consumeInt8(relOffset: number = 0): ?number {
    if (this._available(1, relOffset)) {
      let value = this._readInt8(this.offset + relOffset);
      return this._consume(1 + relOffset, value);
    }
  }

  _consumeUInt8(relOffset: number = 0): ?number {
    if (this._available(1, relOffset)) {
      let value = this._readUInt8(this.offset + relOffset);
      return this._consume(1 + relOffset, value);
    }
  }

  _consumeInt16(relOffset: number = 0): ?number {
    if (this._available(2, relOffset)) {
      let value = this._readInt16(this.offset + relOffset);
      return this._consume(2 + relOffset, value);
    }
  }

  _consumeUInt16(relOffset: number = 0): ?number {
    if (this._available(2, relOffset)) {
      let value = this._readUInt16(this.offset + relOffset);
      return this._consume(2 + relOffset, value);
    }
  }

  _consumeInt32(relOffset: number = 0): ?number {
    if (this._available(4, relOffset)) {
      let value = this._readInt32(this.offset + relOffset);
      return this._consume(4 + relOffset, value);
    }
  }

  _consumeUInt32(relOffset: number = 0): ?number {
    if (this._available(4, relOffset)) {
      let value = this._readUInt32(this.offset + relOffset);
      return this._consume(4 + relOffset, value);
    }
  }

  _consumeInt64(relOffset: number = 0): ?number {
    if (this._available(8, relOffset)) {
      let value = this._readInt64(this.offset + relOffset);
      return this._consume(8 + relOffset, value);
    }
  }

  _consumeFloat(relOffset: number = 0): ?number {
    if (this._available(4, relOffset)) {
      let value = this._readFloat(this.offset + relOffset);
      return this._consume(4 + relOffset, value);
    }
  }

  _consumeDouble(relOffset: number = 0): ?number {
    if (this._available(8, relOffset)) {
      let value = this._readDouble(this.offset + relOffset);
      return this._consume(8 + relOffset, value);
    }
  }

  _consumeString(length: number, relOffset: number = 0): ?number {
    if (this._available(length, relOffset)) {
      let value = this._readString(this.offset + relOffset, length);
      return this._consume(length + relOffset, value);
    }
  }

  _consumeBinary(length: number, relOffset: number = 0): ?number {
    if (this._available(length, relOffset)) {
      let value = this._readBinary(this.offset + relOffset, length);
      return this._consume(length + relOffset, value);
    }
  }
}
