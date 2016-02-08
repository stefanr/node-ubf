/**
 * Universal Binary Format
 * @module ubf
 */
import * as MARKER from "./markers";
import {LEN_OF_MARKER} from "./mod-base";

export const CHUNK_BEGIN = Symbol("{chunk}");

/**
 * Value
 */
export function parseValue(): any {
  switch (this.readMarker()) {
    // Dict
    case MARKER.VAL_DICTX: {
      this.chunkStack.push({ t: "D", v: {} });
      return this.consume(LEN_OF_MARKER, CHUNK_BEGIN);
    }
    // List
    case MARKER.VAL_LISTX: {
      this.chunkStack.push({ t: "L", v: [] });
      return this.consume(LEN_OF_MARKER, CHUNK_BEGIN);
    }
    // String
    case MARKER.VAL_STRX: {
      this.chunkStack.push({ t: "S", v: [] });
      return this.consume(LEN_OF_MARKER, CHUNK_BEGIN);
    }
    // Binary
    case MARKER.VAL_BINX: {
      this.chunkStack.push({ t: "B", v: [] });
      return this.consume(LEN_OF_MARKER, CHUNK_BEGIN);
    }
    // Chunk End
    case MARKER.CHUNK_END: {
      if (!this.chunkStack.length) {
        return;
      }
      let chk = this.chunkStack.pop();
      let val = chk.v;
      switch (chk.t) {
        case "S": {
          val = val.join("");
          break;
        }
        case "B": {
          val = Buffer.concat(val);
          break;
        }
      }
      return this.consume(LEN_OF_MARKER, val);
    }
  }
}
