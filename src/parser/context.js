/**
 * Universal Binary Format
 * @module ubf
 */
import {EventEmitter} from "events";

export class ParserContext extends EventEmitter {

  global: Object;

  valPool: Map<number, any>;
  keyPool: Map<number, string>;

  constructor(global?: Object) {
    super();
    this.global = global || {};

    this.valPool = new Map();
    this.keyPool = new Map();
  }
}
