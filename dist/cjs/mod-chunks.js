"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CHUNK_BEGIN = undefined;
exports.parseValue = parseValue;

var _markers = require("./markers");

var MARKER = _interopRequireWildcard(_markers);

var _modBase = require("./mod-base");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Universal Binary Format
 * @module ubf
 */
var CHUNK_BEGIN = exports.CHUNK_BEGIN = Symbol("{chunk}");

/**
 * Value
 */
function parseValue() {
  switch (this.readMarker()) {
    // Dict
    case MARKER.VAL_DICTX:
      {
        this.chunkStack.push({ t: "D", v: {} });
        return this.consume(_modBase.LEN_OF_MARKER, CHUNK_BEGIN);
      }
    // List
    case MARKER.VAL_LISTX:
      {
        this.chunkStack.push({ t: "L", v: [] });
        return this.consume(_modBase.LEN_OF_MARKER, CHUNK_BEGIN);
      }
    // String
    case MARKER.VAL_STRX:
      {
        this.chunkStack.push({ t: "S", v: [] });
        return this.consume(_modBase.LEN_OF_MARKER, CHUNK_BEGIN);
      }
    // Binary
    case MARKER.VAL_BINX:
      {
        this.chunkStack.push({ t: "B", v: [] });
        return this.consume(_modBase.LEN_OF_MARKER, CHUNK_BEGIN);
      }
    // Chunk End
    case MARKER.CHUNK_END:
      {
        if (!this.chunkStack.length) {
          return;
        }
        var chk = this.chunkStack.pop();
        var val = chk.v;
        switch (chk.t) {
          case "S":
            {
              val = val.join("");
              break;
            }
          case "B":
            {
              val = Buffer.concat(val);
              break;
            }
        }
        return this.consume(_modBase.LEN_OF_MARKER, val);
      }
  }
}