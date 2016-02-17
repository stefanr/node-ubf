/**
 * Universal Binary Format
 * @module ubf
 */
import {EventEmitter} from "events";
import {LEN} from "../info";
import * as MARKER from "../markers";

export class Chunk extends EventEmitter {

  type: string;
  value: Object|Array;

  constructor(type: string, value: Object|Array) {
    super();
    this.type = type;
    this.value = value;
  }
}

export function parseValue(): ?any {
  switch (this._readMarker()) {
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
    // Chunks End
    case MARKER.VAL_XENDC:
    case MARKER.VAL_XEND: {
      if (this._chunkStack.length) {
        return this::endChunk();
      }
      return;
    }
  }
}

function beginChunk(type: string, value: Object|Array): Chunk {
  let chunk = new Chunk(type, value);
  this._chunkStack.push(chunk);
  return this._consume(LEN.MARKER, chunk);
}

function endChunk(): any {
  let chunk = this._chunkStack.pop();
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
  return this._consume(LEN.MARKER, value);
}
