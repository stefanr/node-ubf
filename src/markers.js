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
export const JSON_DETECT_STR  = 0x22;
export const JSON_DETECT_ARR  = 0x5B;
export const JSON_DETECT_OBJ  = 0x7B;

/** ----------------------------------------------
 * Control Markers
 */
export const CTRL_HEADER      = 0xFF;

/** ----------------------------------------------
 * Value : Container : Dict
 */
export const VAL_DICT1        = 0x10;
export const VAL_DICT2        = 0x11;
export const VAL_DICT4        = 0x12;

/** ----------------------------------------------
 * Value : Container : List
 */
export const VAL_LIST1        = 0x14;
export const VAL_LIST2        = 0x15;
export const VAL_LIST4        = 0x16;

/** ----------------------------------------------
 * Value : Data : String
 */
export const VAL_STR1         = 0x20;
export const VAL_STR2         = 0x21;
export const VAL_STR4         = 0x22; // !

/** ----------------------------------------------
 * Value : Data : Binary
 */
export const VAL_BIN1         = 0x24;
export const VAL_BIN2         = 0x25;
export const VAL_BIN4         = 0x26;

/** ----------------------------------------------
 * Value : Primitive: Number
 */
export const VAL_INT8         = 0x30;
export const VAL_INT16        = 0x31;
export const VAL_INT32        = 0x32;
export const VAL_INT64        = 0x33;

export const VAL_FLOAT        = 0x38;
export const VAL_DOUBLE       = 0x39;

/** ----------------------------------------------
 * Value : Primitive: Null
 */
export const VAL_NULL         = 0x40;

/** ----------------------------------------------
 * Value : Primitive: Boolean
 */
export const VAL_FALSE        = 0x41;
export const VAL_TRUE         = 0x42;

/** ----------------------------------------------
 * Key : String
 */
export const KEY_STR1         = 0xD0;
export const KEY_STR2         = 0xD1;

/** ----------------------------------------------------------------------------
 * Variable Length Extension
 */

/** ----------------------------------------------
 * Control Markers
 */
export const VARLEN_END       = 0x00;

/** ----------------------------------------------
 * Varibale Length Value : Container
 */
export const VAL_DICT0        = 0x13;
export const VAL_LIST0        = 0x17;

/** ----------------------------------------------
 * Variable Length Value : Data
 */
export const VAL_STR0         = 0x23;
export const VAL_BIN0         = 0x27;

/** ----------------------------------------------------------------------------
 * Object Pool Extension
 */

/** ----------------------------------------------
 * Object Pool Value
 */
export const POOL_VAL_GET1    = 0xE0;
export const POOL_VAL_GET2    = 0xE1;

export const POOL_VAL_SET1    = 0xE2;
export const POOL_VAL_SET2    = 0xE3;

/** ----------------------------------------------
 * Object Pool Key
 */
export const POOL_KEY_GET1    = 0xE4;
export const POOL_KEY_GET2    = 0xE5;

export const POOL_KEY_SET1    = 0xE6;
export const POOL_KEY_SET2    = 0xE7;
