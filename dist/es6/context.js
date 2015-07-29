/*
 * Universal Binary Format
 * Context
 */
"use strict";

import { EventEmitter } from "yaee";
import { extendContext as objectPoolExtendContext } from "./ext-object-pool";

/**
 * Context
 */

class Context extends EventEmitter {

  constructor(global) {
    super();
    Object.defineProperty(this, "global", {
      value: global || Object.create(null),
      enumerable: true
    });
    objectPoolExtendContext.call(this);
  }
}

export { Context };