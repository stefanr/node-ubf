/**
 * Universal Binary Format
 * @module ubf
 */
import {AbstractParser} from "./parser-abstract";
import * as __base from "./parser/base";
import * as __ctxt from "./parser/context";
import * as __chnk from "./parser/chunks";
import * as __pool from "./parser/const-pool";

export const {ParserContext} = __ctxt;

export class Parser extends AbstractParser {

  context: ParserContext;
  options = {};

  parsing: boolean;

  _chunkStack: Array<Object>;

  constructor(context?: ParserContext, options? = {}) {
    super();
    this.context = context || new ParserContext();
    Object.assign(this.options, options);
    this._chunkStack = [];
  }

  parse(buffer: Buffer): void {
    if (this.buffer && this.offset < this.buffer.length) {
      let rest = this.buffer.slice(this.offset|0);
      this._resetBuffer(Buffer.concat([rest, buffer]));
    } else {
      this._resetBuffer(buffer);
    }
    this.parsing = true;

    while (this.parsing && this.buffer && this.offset < this.buffer.length) {
      // ControlDirective
      if (this._parseControlDirective()) {
        continue;
      }

      // Value
      let value = this._parseValue();
      if (value instanceof __chnk.Chunk) {
        continue;
      } else if (value !== undefined) {
        let chunkDepth = this._chunkStack.length;
        if (chunkDepth) {
          let chunk = this._chunkStack[chunkDepth - 1];
          if (chunk.key) {
            chunk.value[chunk.key] = value;
          } else {
            chunk.value.push(value);
          }
        } else {
          this._handleValue(value);
        }
        continue;
      } else if (this._truncated) {
        this._handleTruncated();
        break;
      }

      let syncOffset = this.offset;

      // Entry
      let key = this._parseKey();
      if (key !== undefined) {
        let chunkDepth = this._chunkStack.length;
        let chunk = this._chunkStack[chunkDepth - 1];
        value = this._parseValue();
        if (value instanceof __chnk.Chunk) {
          chunk.key = key;
          continue;
        } else if (value !== undefined) {
          if (chunk) {
            chunk.value[key] = value;
          } else {
            this._handleEntry(key, value);
          }
          continue;
        } else if (this._truncated) {
          this.offset = syncOffset;
          this._handleTruncated();
          break;
        }

        // Error: Value expected
        this._handleError("Value expected", {
          code: ParseError.Code.VALUE_EXPECTED,
        });
        break;
      } else if (this._truncated) {
        this._handleTruncated();
        break;
      }

      // Error: Unknown marker
      this._handleError("Unknown marker", {
        code: ParseError.Code.UNKNOWN_MARKER,
        marker: this.readMarker(),
      });
      break;
    }
  }

  reset(): void {
    this._chunkStack.length = 0;
    this._resetBuffer();
  }

  _handleValue(value: any): void {
    this.context.emit("value", {value});
  }

  _handleEntry(key: string, value: any): void {
    let oldValue = this.context.global[key];
    this.context.global[key] = value;
    this.context.emit("global", {key, value, oldValue});
  }

  _handleTruncated(): void {
    let {buffer, offset} = this;
    this.context.emit("truncated", {buffer, offset});
  }

  _handleError(msg: string, data?: Object): void {
    let {buffer, offset} = this;
    let detail = Object.assign({code: -1, buffer, offset}, data);
    this.context.emit("error", new ParseError(msg, detail));
    this.reset();
  }

  _parseControlDirective(): ?boolean {
    // Base : Control Directive
    return this::__base.parseControlDirective();
  }

  _parseValue(): ?any {
    // Base : Value
    let value = this::__base.parseValue();
    // Chunks : Value
    if (value === undefined) {
      value = this::__chnk.parseValue();
    }
    // Constant Pool : Value
    if (value === undefined) {
      value = this::__pool.parseValue();
    }
    return value;
  }

  _parseKey(): ?string {
    // Base : Key
    let key = this::__base.parseKey();
    // Constant Pool : Key
    if (key === undefined) {
      key = this::__pool.parseKey();
    }
    return key;
  }
}

class ParseError extends Error {

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
