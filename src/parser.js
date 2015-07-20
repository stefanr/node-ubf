/*
 * Universal Binary Format
 * Parser
 */
import {EventEmitter} from "yaee";
import {AbstractParser} from "./abstract-parser";
import * as base from "./base-parser";
import * as objectPool from "./ext-object-pool";

/**
 * Error Codes
 */
export const ERR_UNKNOWN_MARKER = 0x01;
export const ERR_VALUE_EXPECTED = 0x02;

/**
 * Parser
 */
export class Parser extends AbstractParser {

  context: Context;
  parsing: boolean;

  constructor(context: Context) {
    super();
    this.context = context;
  }

  parse(buffer: Buffer): void {
    if (this.buffer && this.offset < this.buffer.length) {
      this.resetBuffer(Buffer.concat([this.buffer.slice(this.offset|0), buffer]));
    } else {
      this.resetBuffer(buffer);
    }

    this.parsing = true;
    this.truncated = false;

    while (this.offset < this.buffer.length && this.parsing) {
      // ControlDirective ------------------------
      if (this.parseControlDirective()) {
        continue;
      }

      // Value -----------------------------------
      let value = this.parseValue();
      if (value !== undefined) {
        this.emit("value", {value});
        continue;
      } else if (this.truncated) {
        this.emit("truncated", {
          buffer: this.buffer,
          offset: this.offset,
        });
        break;
      }

      // Key Value -------------------------------
      let key = this.parseKey();
      if (key !== undefined) {
        let value = this.parseValue();
        if (value !== undefined) {
          this.context.global[key] = value;
          this.emit("global", {key, value});
          continue;
        } else if (this.truncated) {
          this.emit("truncated", {
            buffer: this.buffer,
            offset: this.offset,
          });
          break;
        }

        // Value expected ------------------------
        this.emit("error", new ParseError("Value expected", {
          code: ERR_VALUE_EXPECTED,
          buffer: this.buffer,
          offset: this.offset,
        }));
        this.resetBuffer();
        break;
      } else if (this.truncated) {
        this.emit("truncated", {
          buffer: this.buffer,
          offset: this.offset,
        });
        break;
      }

      // Unknown marker --------------------------
      this.emit("error", new ParseError("Unknown marker", {
        code: ERR_UNKNOWN_MARKER,
        buffer: this.buffer,
        offset: this.offset,
        marker: this.readMarker(),
      }));
      this.resetBuffer();
      break;
    }
  }

  stop(): void {
    this.parsing = false;
  }

  parseControlDirective(): boolean {
    return this::base.parseControlDirective();
  }

  parseValue(): any {
    // Base Profile : Value ----------------------
    let value = this::base.parseValue();
    // Object Pool Extension : Value -------------
    if (value === undefined) {
      value = this::objectPool.parseValue();
    }
    return value;
  }

  parseKey(): string {
    // Base Profile : Key ------------------------
    let key = this::base.parseKey();
    // Object Pool Extension : Key ---------------
    if (key === undefined) {
      key = this::objectPool.parseKey();
    }
    return key;
  }
}

/**
 * ParseError
 */
export class ParseError extends Error {

  detail: object;

  constructor(message: string, detail: object) {
    super(message);
    this.name = "ParseError";
    this.message = message || "Unknown error";
    this.detail = detail || {};
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ParseError);
    }
  }
}
