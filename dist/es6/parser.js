/*
 * Universal Binary Format
 * Parser
 */
"use strict";

import { EventEmitter } from "yaee";
import { AbstractParser } from "./abstract-parser";
import * as base from "./base-parser";
import * as objectPool from "./ext-object-pool";

/**
 * Error Codes
 */
const ERR_UNKNOWN_MARKER = 0x01;
export { ERR_UNKNOWN_MARKER };
const ERR_VALUE_EXPECTED = 0x02;

export { ERR_VALUE_EXPECTED };
/**
 * Parser
 */

class Parser extends AbstractParser {

  constructor(context) {
    super();
    this.context = context;
  }

  parse(buffer) {
    if (this.buffer && this.offset < this.buffer.length) {
      this.resetBuffer(Buffer.concat([this.buffer.slice(this.offset | 0), buffer]));
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
        this.emit("value", { value });
        continue;
      } else if (this.truncated) {
        this.emit("truncated", {
          buffer: this.buffer,
          offset: this.offset
        });
        break;
      }

      // Key Value -------------------------------
      let key = this.parseKey();
      if (key !== undefined) {
        let value = this.parseValue();
        if (value !== undefined) {
          this.context.global[key] = value;
          this.emit("global", { key, value });
          continue;
        } else if (this.truncated) {
          this.emit("truncated", {
            buffer: this.buffer,
            offset: this.offset
          });
          break;
        }

        // Value expected ------------------------
        this.emit("error", new ParseError("Value expected", {
          code: ERR_VALUE_EXPECTED,
          buffer: this.buffer,
          offset: this.offset
        }));
        this.resetBuffer();
        break;
      } else if (this.truncated) {
        this.emit("truncated", {
          buffer: this.buffer,
          offset: this.offset
        });
        break;
      }

      // Unknown marker --------------------------
      this.emit("error", new ParseError("Unknown marker", {
        code: ERR_UNKNOWN_MARKER,
        buffer: this.buffer,
        offset: this.offset,
        marker: this.readMarker()
      }));
      this.resetBuffer();
      break;
    }
  }

  stop() {
    this.parsing = false;
  }

  parseControlDirective() {
    return base.parseControlDirective.call(this);
  }

  parseValue() {
    // Base Profile : Value ----------------------
    let value = base.parseValue.call(this);
    // Object Pool Extension : Value -------------
    if (value === undefined) {
      value = objectPool.parseValue.call(this);
    }
    return value;
  }

  parseKey() {
    // Base Profile : Key ------------------------
    let key = base.parseKey.call(this);
    // Object Pool Extension : Key ---------------
    if (key === undefined) {
      key = objectPool.parseKey.call(this);
    }
    return key;
  }
}

export { Parser };

/**
 * ParseError
 */

class ParseError extends Error {

  constructor(message, detail) {
    super(message);
    this.name = "ParseError";
    this.message = message || "Unknown error";
    this.detail = detail || {};
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ParseError);
    }
  }
}

export { ParseError };