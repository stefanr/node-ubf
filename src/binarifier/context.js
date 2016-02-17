/**
 * Universal Binary Format
 * @module ubf
 */
import {EventEmitter} from "events";

export class BinarifierContext extends EventEmitter {

  valPool: Map<any, number>;
  keyPool: Map<string, number>;

  constructor() {
    super();

    this.valPool = new Map();
    this.keyPool = new Map();
  }
}
