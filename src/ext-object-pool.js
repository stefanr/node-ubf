/*
 * Universal Binary Format
 * Object Pool Extension
 */
import * as MARKER from "./markers";
import {
  LEN_OF_MARKER,
  LEN_OF_SIZE1,
  LEN_OF_SIZE2,
  LEN_OF_SIZE4
} from "./base-parser";

/**
 * Object Pool Extension : extendContext
 */
export function extendContext() {
  Object.defineProperty(this, "pool", {
    value: {
      values: new Map(),
      keys: new Map(),
    },
    enumerable: true,
  });
}

/**
 * Object Pool Extension : parseValue
 */
export function parseValue(): any {
  switch (this.readMarker()) {
    // Get Pool Value --------------------------
    case MARKER.POOL_VAL_GET1: {
      let id = this.consumeUInt8(LEN_OF_MARKER);
      if (id === undefined) {
        return;
      }
      return this.context::getPoolValue(id);
    }
    case MARKER.POOL_VAL_GET2: {
      let id = this.consumeUInt16(LEN_OF_MARKER);
      if (id === undefined) {
        return;
      }
      return this.context::getPoolValue(id);
    }

    // Set Pool Value --------------------------
    case MARKER.POOL_VAL_SET1: {
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
    case MARKER.POOL_VAL_SET2: {
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
 * Object Pool Extension : parseKey
 */
export function parseKey(): string {
  switch (this.readMarker()) {
    // Get Pool Key ----------------------------
    case MARKER.POOL_KEY_GET1: {
      let id = this.consumeUInt8(LEN_OF_MARKER);
      if (id === undefined) {
        return;
      }
      return this.context::getPoolKey(id);
    }
    case MARKER.POOL_KEY_GET2: {
      let id = this.consumeUInt16(LEN_OF_MARKER);
      if (id === undefined) {
        return;
      }
      return this.context::getPoolKey(id);
    }

    // Set Pool Key ----------------------------
    case MARKER.POOL_KEY_SET1: {
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
    case MARKER.POOL_KEY_SET2: {
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

/**
 * Object Pool Extension : getPoolValue
 */
export function getPoolValue(id: number): any {
  return this.pool && this.pool.values.get(id);
}

/**
 * Object Pool Extension : setPoolValue
 */
export function setPoolValue(id: number, value: any): any {
  this.pool && this.pool.values.set(id, value);
  return value;
}

/**
 * Object Pool Extension : getPoolKey
 */
export function getPoolKey(id: number): string {
  return this.pool && this.pool.keys.get(id);
}

/**
 * Object Pool Extension : setPoolKey
 */
export function setPoolKey(id: number, key: string): string {
  this.pool && this.pool.keys.set(id, key);
  return key;
}
