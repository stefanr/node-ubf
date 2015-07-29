/*
 * Universal Binary Format
 * Byte Markers
 */

/** ----------------------------------------------------------------------------
 * Base Profile
 */

/** ----------------------------------------------
 * Reserved Markers
 * JSON Detection
 */
"use strict";

const JSON_DETECT_STR = 0x22;
export { JSON_DETECT_STR };
const JSON_DETECT_ARR = 0x5B;
export { JSON_DETECT_ARR };
const JSON_DETECT_OBJ = 0x7B;

export { JSON_DETECT_OBJ };
/** ----------------------------------------------
 * Control Markers
 */
const CTRL_HEADER = 0xFF;

export { CTRL_HEADER };
/** ----------------------------------------------
 * Value : Container : Dict
 */
const VAL_DICT1 = 0x10;
export { VAL_DICT1 };
const VAL_DICT2 = 0x11;
export { VAL_DICT2 };
const VAL_DICT4 = 0x12;

export { VAL_DICT4 };
/** ----------------------------------------------
 * Value : Container : List
 */
const VAL_LIST1 = 0x14;
export { VAL_LIST1 };
const VAL_LIST2 = 0x15;
export { VAL_LIST2 };
const VAL_LIST4 = 0x16;

export { VAL_LIST4 };
/** ----------------------------------------------
 * Value : Data : String
 */
const VAL_STR1 = 0x20;
export { VAL_STR1 };
const VAL_STR2 = 0x21;
export { VAL_STR2 };
const VAL_STR4 = 0x22;export { VAL_STR4 };
// !

/** ----------------------------------------------
 * Value : Data : Binary
 */
const VAL_BIN1 = 0x24;
export { VAL_BIN1 };
const VAL_BIN2 = 0x25;
export { VAL_BIN2 };
const VAL_BIN4 = 0x26;

export { VAL_BIN4 };
/** ----------------------------------------------
 * Value : Primitive: Number
 */
const VAL_INT8 = 0x30;
export { VAL_INT8 };
const VAL_INT16 = 0x31;
export { VAL_INT16 };
const VAL_INT32 = 0x32;
export { VAL_INT32 };
const VAL_INT64 = 0x33;

export { VAL_INT64 };
const VAL_FLOAT = 0x38;
export { VAL_FLOAT };
const VAL_DOUBLE = 0x39;

export { VAL_DOUBLE };
/** ----------------------------------------------
 * Value : Primitive: Null
 */
const VAL_NULL = 0x40;

export { VAL_NULL };
/** ----------------------------------------------
 * Value : Primitive: Boolean
 */
const VAL_FALSE = 0x41;
export { VAL_FALSE };
const VAL_TRUE = 0x42;

export { VAL_TRUE };
/** ----------------------------------------------
 * Key : String
 */
const KEY_STR1 = 0xD0;
export { KEY_STR1 };
const KEY_STR2 = 0xD1;

export { KEY_STR2 };
/** ----------------------------------------------------------------------------
 * Variable Length Extension
 */

/** ----------------------------------------------
 * Control Markers
 */
const VARLEN_END = 0x00;

export { VARLEN_END };
/** ----------------------------------------------
 * Varibale Length Value : Container
 */
const VAL_DICT0 = 0x13;
export { VAL_DICT0 };
const VAL_LIST0 = 0x17;

export { VAL_LIST0 };
/** ----------------------------------------------
 * Variable Length Value : Data
 */
const VAL_STR0 = 0x23;
export { VAL_STR0 };
const VAL_BIN0 = 0x27;

export { VAL_BIN0 };
/** ----------------------------------------------------------------------------
 * Object Pool Extension
 */

/** ----------------------------------------------
 * Object Pool Value
 */
const POOL_VAL_GET1 = 0xE0;
export { POOL_VAL_GET1 };
const POOL_VAL_GET2 = 0xE1;

export { POOL_VAL_GET2 };
const POOL_VAL_SET1 = 0xE2;
export { POOL_VAL_SET1 };
const POOL_VAL_SET2 = 0xE3;

export { POOL_VAL_SET2 };
/** ----------------------------------------------
 * Object Pool Key
 */
const POOL_KEY_GET1 = 0xE4;
export { POOL_KEY_GET1 };
const POOL_KEY_GET2 = 0xE5;

export { POOL_KEY_GET2 };
const POOL_KEY_SET1 = 0xE6;
export { POOL_KEY_SET1 };
const POOL_KEY_SET2 = 0xE7;
export { POOL_KEY_SET2 };