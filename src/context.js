/*
 * Universal Binary Format
 * Context
 */
import {EventEmitter} from "yaee";
import {extendContext as objectPoolExtendContext} from "./ext-object-pool";

/**
 * Context
 */
export class Context extends EventEmitter {

  global: object;

  constructor(global: object) {
    super();
    Object.defineProperty(this, "global", {
      value: global || Object.create(null),
      enumerable: true,
    });
    this::objectPoolExtendContext();
  }
}
