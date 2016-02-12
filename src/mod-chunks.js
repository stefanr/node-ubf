/**
 * Universal Binary Format
 * @module ubf
 */
import {EventEmitter} from "events";
import * as MARKER from "./markers";
import * as base from "./mod-base";

export class Chunk extends EventEmitter {

  type: string;
  value: Object|Array;

  constructor(type: string, value: Object|Array) {
    super();
    this.type = type;
    this.value = value;
  }
}

/**
 * Value
 */
export function parseValue(): any {
  switch (this.readMarker()) {
    // Dict
    case MARKER.VAL_DICTX: {
      return this::beginChunk("D", {});
    }
    // List
    case MARKER.VAL_LISTX: {
      return this::beginChunk("L", []);
    }
    // String
    case MARKER.VAL_STRX: {
      return this::beginChunk("S", []);
    }
    // Binary
    case MARKER.VAL_BINX: {
      return this::beginChunk("B", []);
    }
    // :End
    case MARKER.CHUNK_END: {
      if (!this.chunkStack.length) {
        return;
      }
      return this::endChunk();
    }
  }
}

function beginChunk(type: string, value: Object|Array): Chunk {
  let chunk = new Chunk(type, value);
  this.chunkStack.push(chunk);
  return this.consume(base.LEN_OF_MARKER, chunk);
}

function endChunk(): any {
  let chunk = this.chunkStack.pop();
  let {type, value} = chunk;
  switch (type) {
    case "S": {
      value = value.join("");
      break;
    }
    case "B": {
      value = Buffer.concat(value);
      break;
    }
  }
  chunk.emit("end", {value});
  return this.consume(base.LEN_OF_MARKER, value);
}
