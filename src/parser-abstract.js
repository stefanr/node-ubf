/**
 * Universal Binary Format
 * @module ubf
 */
import Int64 from "node-int64";

export class AbstractParser {

  buffer: Buffer;
  offset: number;

  parsing: boolean;
  truncated: boolean;

  resetBuffer(buffer: Buffer): void {
    this.buffer = buffer || null;
    this.offset = 0;
  }

  readMarker(offset: number = this.offset): number {
    return this.readUInt8(offset|0)|0;
  }

  available(length: number, relOffset: number = 0): boolean {
    if (this.offset + relOffset + length > this.buffer.length) {
      this.truncated = true;
      return false;
    }
    return true;
  }

  // Read operations -------------------------------------------------

  readInt8(offset: number): number {
    return +this.buffer.readInt8(offset|0, true);
  }

  readUInt8(offset: number): number {
    return +this.buffer.readUInt8(offset|0, true);
  }

  readInt16(offset: number): number {
    return +this.buffer.readInt16BE(offset|0, true);
  }

  readUInt16(offset: number): number {
    return +this.buffer.readUInt16BE(offset|0, true);
  }

  readInt32(offset: number): number {
    return +this.buffer.readInt32BE(offset|0, true);
  }

  readUInt32(offset: number): number {
    return +this.buffer.readUInt32BE(offset|0, true);
  }

  readInt64(offset: number): number {
    return +(new Int64(this.buffer, offset|0).toNumber(false));
  }

  readFloat(offset: number): number {
    return +this.buffer.readFloatBE(offset|0, true);
  }

  readDouble(offset: number): number {
    return +this.buffer.readDoubleBE(offset|0, true);
  }

  readString(offset: number, length: number): string {
    return this.buffer.toString("utf8", offset|0, (offset + length)|0);
  }

  readBinary(offset: number, length: number): Buffer {
    return this.buffer.slice(offset|0, (offset + length)|0);
  }

  // Consume operations ----------------------------------------------

  consume(length: number, value: any): any {
    this.offset += length|0;
    return value;
  }

  rewind(length: number): void {
    this.offset -= length|0;
  }

  consumeInt8(relOffset: number = 0): number {
    if (!this.available(1, relOffset)) {
      return;
    }
    return +this.consume(1 + relOffset, +this.readInt8(this.offset + relOffset));
  }

  consumeUInt8(relOffset: number = 0): number {
    if (!this.available(1, relOffset)) {
      return;
    }
    return +this.consume(1 + relOffset, +this.readUInt8(this.offset + relOffset));
  }

  consumeInt16(relOffset: number = 0): number {
    if (!this.available(2, relOffset)) {
      return;
    }
    return +this.consume(2 + relOffset, +this.readInt16(this.offset + relOffset));
  }

  consumeUInt16(relOffset: number = 0): number {
    if (!this.available(2, relOffset)) {
      return;
    }
    return +this.consume(2 + relOffset, +this.readUInt16(this.offset + relOffset));
  }

  consumeInt32(relOffset: number = 0): number {
    if (!this.available(4, relOffset)) {
      return;
    }
    return +this.consume(4 + relOffset, +this.readInt32(this.offset + relOffset));
  }

  consumeUInt32(relOffset: number = 0): number {
    if (!this.available(4, relOffset)) {
      return;
    }
    return +this.consume(4 + relOffset, +this.readUInt32(this.offset + relOffset));
  }

  consumeInt64(relOffset: number = 0): number {
    if (!this.available(8, relOffset)) {
      return;
    }
    return +this.consume(8 + relOffset, +this.readInt64(this.offset + relOffset));
  }

  consumeFloat(relOffset: number = 0): number {
    if (!this.available(4, relOffset)) {
      return;
    }
    return +this.consume(4 + relOffset, +this.readFloat(this.offset + relOffset));
  }

  consumeDouble(relOffset: number = 0): number {
    if (!this.available(8, relOffset)) {
      return;
    }
    return +this.consume(8 + relOffset, +this.readDouble(this.offset + relOffset));
  }

  consumeString(length: number, relOffset: number = 0): number {
    if (!this.available(length, relOffset)) {
      return;
    }
    return this.consume(length + relOffset, this.readString(this.offset + relOffset, length));
  }

  consumeBinary(length: number, relOffset: number = 0): number {
    if (!this.available(length, relOffset)) {
      return;
    }
    return this.consume(length + relOffset, this.readBinary(this.offset + relOffset, length));
  }
}
