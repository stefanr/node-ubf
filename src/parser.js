/**
 * Universal Binary Format
 * @module ubf
 */
import {AbstractParser} from "./parser-abstract";
import {Context} from "./mod-context";
import * as base from "./mod-base";
import * as constPool from "./mod-const-pool";
import * as chunks from "./mod-chunks";

export class Parser extends AbstractParser {

  context: Context;
  chunkStack: Array<Object>;

  constructor(context?: Context) {
    super();
    this.context = context || new Context();
    this.chunkStack = [];
  }

  parse(buffer: Buffer): void {
    if (this.buffer && this.offset < this.buffer.length) {
      let buffer_ = Buffer.concat([this.buffer.slice(this.offset|0), buffer]);
      this.resetBuffer(buffer_);
    } else {
      this.resetBuffer(buffer);
    }

    this.parsing = true;
    this.truncated = false;

    while (this.offset < this.buffer.length && this.parsing) {
      // ControlDirective
      if (this.parseControlDirective()) {
        continue;
      }

      // Value
      let value = this.parseValue();
      if (value === chunks.CHUNK_BEGIN) {
        continue;
      } else if (value !== undefined) {
        let lvl = this.chunkStack.length;
        if (lvl) {
          let chk = this.chunkStack[lvl - 1];
          if (chk.k) {
            chk.v[chk.k] = value;
          } else {
            chk.v.push(value);
          }
        } else {
          this.context.emit("value", {value});
        }
        continue;
      } else if (this.truncated) {
        this.context._handleTruncated();
        break;
      }

      // Entry
      let key = this.parseKey();
      if (key !== undefined) {
        let lvl = this.chunkStack.length;
        let chk = lvl && this.chunkStack[lvl - 1];
        value = this.parseValue();
        if (value === chunks.CHUNK_BEGIN) {
          chk.k = key;
          continue;
        } else if (value !== undefined) {
          if (chk) {
            chk.v[key] = value;
          } else {
            this.context.global[key] = value;
            this.context.emit("global", {key, value});
          }
          continue;
        } else if (this.truncated) {
          this.context._handleTruncated();
          break;
        }

        // Error: Value expected
        let err = new ParseError("Value expected", {
          code: ParseError.Code.ERR_VALUE_EXPECTED,
          buffer: this.buffer,
          offset: this.offset,
        });
        this.context.emit("error", err);
        this.resetBuffer();
        break;
      } else if (this.truncated) {
        this.context._handleTruncated();
        break;
      }

      // Error: Unknown marker
      let err = new ParseError("Unknown marker", {
        code: ParseError.Code.UNKNOWN_MARKER,
        buffer: this.buffer,
        offset: this.offset,
        marker: this.readMarker(),
      });
      this.context.emit("error", err);
      this.resetBuffer();
      break;
    }
  }

  _handleTruncated(): void {
    this.context.emit("truncated", {
      buffer: this.buffer,
      offset: this.offset,
    });
  }

  stop(): void {
    this.parsing = false;
  }

  parseControlDirective(): boolean {
    return this::base.parseControlDirective();
  }

  parseValue(): any {
    // Base / Value
    let value = this::base.parseValue();
    // Constant Pool / Value
    if (value === undefined) {
      value = this::constPool.parseValue();
    }
    // Chunks / Value
    if (value === undefined) {
      value = this::chunks.parseValue();
    }
    return value;
  }

  parseKey(): string {
    // Base / Key
    let key = this::base.parseKey();
    // Constant Pool / Key
    if (key === undefined) {
      key = this::constPool.parseKey();
    }
    return key;
  }
}

export {Context};

export class ParseError extends Error {

  detail: Object;

  static Code = {
    UNKNOWN_MARKER: 0x01,
    VALUE_EXPECTED: 0x02,
  };

  constructor(message: string, detail: Object) {
    super(message);
    this.name = "ParseError";
    this.message = message || "Unknown error";
    this.detail = detail || {};
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ParseError);
    }
  }
}
