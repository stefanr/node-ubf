/**
 * Universal Binary Format
 * @module ubf
 */
import {LEN} from "../info";
import * as MARKER from "../markers";
import * as __chnk from "./chunks";

export const POOL_UNDEFINED = Symbol("{undefined}");

export function parseValue(): ?any {
  switch (this._readMarker()) {
    // Value : Get
    case MARKER.VAL_POOL_GET1: {
      let id = this._consumeUInt8(LEN.MARKER);
      if (id === undefined) {
        return;
      }
      return this.context::getPoolValue(id);
    }
    case MARKER.VAL_POOL_GET2: {
      let id = this._consumeUInt16(LEN.MARKER);
      if (id === undefined) {
        return;
      }
      return this.context::getPoolValue(id);
    }

    // Value : Set
    case MARKER.VAL_POOL_SET1: {
      let id = this._consumeUInt8(LEN.MARKER);
      if (id === undefined) {
        return;
      }
      let value = this._parseValue();
      if (value === undefined) {
        this._rewind(LEN.MARKER + LEN.SIZE1);
        return;
      } else if (value instanceof __chnk.Chunk) {
        return this::handleChunk(id, value);
      }
      return this.context::setPoolValue(id, value);
    }
    case MARKER.VAL_POOL_SET2: {
      let id = this._consumeUInt16(LEN.MARKER);
      if (id === undefined) {
        return;
      }
      let value = this._parseValue();
      if (value === undefined) {
        this._rewind(LEN.MARKER + LEN.SIZE2);
        return;
      } else if (value instanceof __chnk.Chunk) {
        return this::handleChunk(id, value);
      }
      return this.context::setPoolValue(id, value);
    }
  }
}

function handleChunk(id: number, chunk: __chnk.Chunk) {
  this.context::setPoolValue(id, POOL_UNDEFINED);
  chunk.on("end", ({value}) => {
    this.context::setPoolValue(id, value);
  });
  return chunk;
}

export function parseKey(): ?string {
  switch (this._readMarker()) {
    // Pool : Get
    case MARKER.KEY_POOL_GET1: {
      let id = this._consumeUInt8(LEN.MARKER);
      if (id === undefined) {
        return;
      }
      return this.context::getPoolKey(id);
    }
    case MARKER.KEY_POOL_GET2: {
      let id = this._consumeUInt16(LEN.MARKER);
      if (id === undefined) {
        return;
      }
      return this.context::getPoolKey(id);
    }

    // Key : Set
    case MARKER.KEY_POOL_SET1: {
      let id = this._consumeUInt8(LEN.MARKER);
      if (id === undefined) {
        return;
      }
      let key = this._parseKey();
      if (key === undefined) {
        this._rewind(LEN.MARKER + LEN.SIZE1);
        return;
      }
      return this.context::setPoolKey(id, key);
    }
    case MARKER.KEY_POOL_SET2: {
      let id = this._consumeUInt16(LEN.MARKER);
      if (id === undefined) {
        return;
      }
      let key = this._parseKey();
      if (key === undefined) {
        this.rewind(LEN.MARKER + LEN.SIZE2);
        return;
      }
      return this.context::setPoolKey(id, key);
    }
  }
}

function getPoolValue(id: number): ?any {
  return this.valPool.get(id);
}

function setPoolValue(id: number, value: any): any {
  this.valPool.set(id, value);
  return value;
}

function getPoolKey(id: number): ?string {
  return this.keyPool.get(id);
}

function setPoolKey(id: number, key: string): string {
  this.keyPool.set(id, key);
  return key;
}
