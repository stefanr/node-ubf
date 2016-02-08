/**
 * Universal Binary Format
 * @module ubf
 */

/*eslint-disable no-multi-spaces */

/**
 * Control Markers
 */
export const CTRL_HEADER      = 0xFF;

/**
 * Reserved Markers
 * JSON Detection
 */
export const JSON_DETECT_ARR  = 0x5B;
export const JSON_DETECT_OBJ  = 0x7B;

/**
 * Base Module
 */

/**
 * Base / Value : Dict
 */
export const VAL_DICT1        = 0x10;
export const VAL_DICT2        = 0x11;
export const VAL_DICT4        = 0x12;

/**
 * Base / Value : List
 */
export const VAL_LIST1        = 0x14;
export const VAL_LIST2        = 0x15;
export const VAL_LIST4        = 0x16;

/**
 * Base / Value : String
 */
export const VAL_STR1         = 0x20;
export const VAL_STR2         = 0x21;
export const VAL_STR4         = 0x22;

/**
 * Base / Value : Binary
 */
export const VAL_BIN1         = 0x24;
export const VAL_BIN2         = 0x25;
export const VAL_BIN4         = 0x26;

/**
 * Base / Value : Number
 */
export const VAL_INT8         = 0x30;
export const VAL_INT16        = 0x31;
export const VAL_INT32        = 0x32;
export const VAL_INT64        = 0x33;
export const VAL_FLOAT        = 0x38;
export const VAL_DOUBLE       = 0x39;

/**
 * Base / Value : Boolean
 */
export const VAL_FALSE        = 0x40;
export const VAL_TRUE         = 0x41;

/**
 * Base / Value : Null
 */
export const VAL_NULL         = 0x42;

/**
 * Base / Key : String
 */
export const KEY_STR1         = 0xE0;
export const KEY_STR2         = 0xE1;

/**
 * Chunks Module
 */

/**
 * Chunks / Control Markers
 */
export const CHUNK_END        = 0x00;

/**
 * Chunks / Value : Dict & List
 */
export const VAL_DICTX        = 0x1C;
export const VAL_LISTX        = 0x1D;

/**
 * Chunks / Value : String & Binary
 */
export const VAL_STRX         = 0x2C;
export const VAL_BINX         = 0x2D;

/**
 * Constant Pool Module
 */

/**
 * Constant Pool / Value
 */
export const VAL_POOL_GET1    = 0xC0;
export const VAL_POOL_GET2    = 0xC1;

export const VAL_POOL_SET1    = 0xC2;
export const VAL_POOL_SET2    = 0xC3;

/**
 * Constant Pool / Key
 */
export const KEY_POOL_GET1    = 0xC4;
export const KEY_POOL_GET2    = 0xC5;

export const KEY_POOL_SET1    = 0xC6;
export const KEY_POOL_SET2    = 0xC7;
