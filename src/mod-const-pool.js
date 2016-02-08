/**
 * Universal Binary Format
 * @module ubf
 */
import * as MARKER from "./markers";
import {
  LEN_OF_MARKER,
  LEN_OF_SIZE1,
  LEN_OF_SIZE2,
} from "./mod-base";

/**
 * Value
 */
export function parseValue(): any {
  switch (this.readMarker()) {
    // Value : Get
    case MARKER.VAL_POOL_GET1: {
      let id = this.consumeUInt8(LEN_OF_MARKER);
      if (id === undefined) {
        return;
      }
      return this.context::getPoolValue(id);
    }
    case MARKER.VAL_POOL_GET2: {
      let id = this.consumeUInt16(LEN_OF_MARKER);
      if (id === undefined) {
        return;
      }
      return this.context::getPoolValue(id);
    }

    // Value : Set
    case MARKER.VAL_POOL_SET1: {
      let id = this.consumeUInt8(LEN_OF_MARKER);
      if (id === undefined) {
        return;
      }
      let value = this.parseValue();
      if (value === undefined) {
        this.rewind(LEN_OF_MARKER + LEN_OF_SIZE1);
        return;
      }
      return this.context::setPoolValue(id, value);
    }
    case MARKER.VAL_POOL_SET2: {
      let id = this.consumeUInt16(LEN_OF_MARKER);
      if (id === undefined) {
        return;
      }
      let value = this.parseValue();
      if (value === undefined) {
        this.rewind(LEN_OF_MARKER + LEN_OF_SIZE2);
        return;
      }
      return this.context::setPoolValue(id, value);
    }
  }
}

/**
 * Key
 */
export function parseKey(): string {
  switch (this.readMarker()) {
    // Pool : Get
    case MARKER.KEY_POOL_GET1: {
      let id = this.consumeUInt8(LEN_OF_MARKER);
      if (id === undefined) {
        return;
      }
      return this.context::getPoolKey(id);
    }
    case MARKER.KEY_POOL_GET2: {
      let id = this.consumeUInt16(LEN_OF_MARKER);
      if (id === undefined) {
        return;
      }
      return this.context::getPoolKey(id);
    }

    // Key : Set
    case MARKER.KEY_POOL_SET1: {
      let id = this.consumeUInt8(LEN_OF_MARKER);
      if (id === undefined) {
        return;
      }
      let key = this.parseKey();
      if (key === undefined) {
        this.rewind(LEN_OF_MARKER + LEN_OF_SIZE1);
        return;
      }
      return this.context::setPoolKey(id, key);
    }
    case MARKER.KEY_POOL_SET2: {
      let id = this.consumeUInt16(LEN_OF_MARKER);
      if (id === undefined) {
        return;
      }
      let key = this.parseKey();
      if (key === undefined) {
        this.rewind(LEN_OF_MARKER + LEN_OF_SIZE2);
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
