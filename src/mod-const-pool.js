/**
 * Universal Binary Format
 * @module ubf
 */
import * as MARKER from "./markers";
import * as base from "./mod-base";
import * as chunks from "./mod-chunks";

export const POOL_UNDEFINED = Symbol("{undefined}");

/**
 * Value
 */
export function parseValue(): any {
  switch (this.readMarker()) {
    // Value : Get
    case MARKER.VAL_POOL_GET1: {
      let id = this.consumeUInt8(base.LEN_OF_MARKER);
      if (id === undefined) {
        return;
      }
      return this.context::getPoolValue(id);
    }
    case MARKER.VAL_POOL_GET2: {
      let id = this.consumeUInt16(base.LEN_OF_MARKER);
      if (id === undefined) {
        return;
      }
      return this.context::getPoolValue(id);
    }

    // Value : Set
    case MARKER.VAL_POOL_SET1: {
      let id = this.consumeUInt8(base.LEN_OF_MARKER);
      if (id === undefined) {
        return;
      }
      let value = this.parseValue();
      if (value === undefined) {
        this.rewind(base.LEN_OF_MARKER + base.LEN_OF_SIZE1);
        return;
      } else if (value instanceof chunks.Chunk) {
        return this::handleChunk(id, value);
      }
      return this.context::setPoolValue(id, value);
    }
    case MARKER.VAL_POOL_SET2: {
      let id = this.consumeUInt16(base.LEN_OF_MARKER);
      if (id === undefined) {
        return;
      }
      let value = this.parseValue();
      if (value === undefined) {
        this.rewind(base.LEN_OF_MARKER + base.LEN_OF_SIZE2);
        return;
      } else if (value instanceof chunks.Chunk) {
        return this::handleChunk(id, value);
      }
      return this.context::setPoolValue(id, value);
    }
  }
}

function handleChunk(id: number, chunk: chunks.Chunk) {
  this.context::setPoolValue(id, POOL_UNDEFINED);
  chunk.on("end", ({value}) => {
    this.context::setPoolValue(id, value);
  });
  return chunk;
}

/**
 * Key
 */
export function parseKey(): string {
  switch (this.readMarker()) {
    // Pool : Get
    case MARKER.KEY_POOL_GET1: {
      let id = this.consumeUInt8(base.LEN_OF_MARKER);
      if (id === undefined) {
        return;
      }
      return this.context::getPoolKey(id);
    }
    case MARKER.KEY_POOL_GET2: {
      let id = this.consumeUInt16(base.LEN_OF_MARKER);
      if (id === undefined) {
        return;
      }
      return this.context::getPoolKey(id);
    }

    // Key : Set
    case MARKER.KEY_POOL_SET1: {
      let id = this.consumeUInt8(base.LEN_OF_MARKER);
      if (id === undefined) {
        return;
      }
      let key = this.parseKey();
      if (key === undefined) {
        this.rewind(base.LEN_OF_MARKER + base.LEN_OF_SIZE1);
        return;
      }
      return this.context::setPoolKey(id, key);
    }
    case MARKER.KEY_POOL_SET2: {
      let id = this.consumeUInt16(base.LEN_OF_MARKER);
      if (id === undefined) {
        return;
      }
      let key = this.parseKey();
      if (key === undefined) {
        this.rewind(base.LEN_OF_MARKER + base.LEN_OF_SIZE2);
        return;
      }
      return this.context::setPoolKey(id, key);
    }
  }
}

function getPoolValue(id: number): any {
  return this.valPool.get(id);
}

function setPoolValue(id: number, value: any): any {
  this.valPool.set(id, value);
  return value;
}

function getPoolKey(id: number): string {
  return this.keyPool.get(id);
}

function setPoolKey(id: number, key: string): string {
  this.keyPool.set(id, key);
  return key;
}
