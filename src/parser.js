/**
 * Universal Binary Format
 * @module ubf
 */
import {AbstractParser} from "./parser-abstract";
import {Context} from "./mod-context";
import * as base from "./mod-base";
import * as chunks from "./mod-chunks";
import * as constPool from "./mod-const-pool";

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
      let rest = this.buffer.slice(this.offset|0);
      this.resetBuffer(Buffer.concat([rest, buffer]));
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
      if (value instanceof chunks.Chunk) {
        continue;
      } else if (value !== undefined) {
        let chunkDepth = this.chunkStack.length;
        if (chunkDepth) {
          let chunk = this.chunkStack[chunkDepth - 1];
          if (chunk.type === "D") {
            chunk.value[chunk.key] = value;
          } else {
            chunk.value.push(value);
          }
        } else {
          this._handleValue(value);
        }
        continue;
      } else if (this.truncated) {
        this._handleTruncated();
        break;
      }

      let syncOffset = this.offset;

      // Entry
      let key = this.parseKey();
      if (key !== undefined) {
        let chunkDepth = this.chunkStack.length;
        let chunk = this.chunkStack[chunkDepth - 1];
        value = this.parseValue();
        if (value instanceof chunks.Chunk) {
          chunk.key = key;
          continue;
        } else if (value !== undefined) {
          if (chunk) {
            chunk.value[key] = value;
          } else {
            this._handleEntry(key, value);
          }
          continue;
        } else if (this.truncated) {
          this.offset = syncOffset;
          this._handleTruncated();
          break;
        }

        // Error: Value expected
        this._handleError("Value expected", {
          code: ParseError.Code.VALUE_EXPECTED,
        });
        this.resetBuffer();
        break;
      } else if (this.truncated) {
        this._handleTruncated();
        break;
      }

      // Error: Unknown marker
      this._handleError("Unknown marker", {
        code: ParseError.Code.UNKNOWN_MARKER,
        marker: this.readMarker(),
      });
      this.resetBuffer();
      break;
    }
  }

  stop(): void {
    this.parsing = false;
  }

  _handleValue(value: any): void {
    this.context.emit("value", {value});
  }

  _handleEntry(key: string, value: any): void {
    this.context.global[key] = value;
    this.context.emit("global", {key, value});
  }

  _handleTruncated(): void {
    let {buffer, offset} = this;
    this.context.emit("truncated", {buffer, offset});
  }

  _handleError(msg: string, data?: Object): void {
    let {buffer, offset} = this;
    let detail = Object.assign({code: -1, buffer, offset}, data);
    this.context.emit("error", new ParseError(msg, detail));
  }

  parseControlDirective(): boolean {
    return this::base.parseControlDirective();
  }

  parseValue(): any {
    if (!this.available(base.LEN_OF_MARKER)) {
      return;
    }
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

  constructor(message: string, detail?: Object) {
    super(message);
    this.name = "ParseError";
    this.message = message || "Unknown error";
    this.detail = detail || {};
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ParseError);
    }
  }
}
