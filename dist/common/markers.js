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

Object.defineProperty(exports, "__esModule", {
  value: true
});
var JSON_DETECT_STR = 0x22;
exports.JSON_DETECT_STR = JSON_DETECT_STR;
var JSON_DETECT_ARR = 0x5B;
exports.JSON_DETECT_ARR = JSON_DETECT_ARR;
var JSON_DETECT_OBJ = 0x7B;

exports.JSON_DETECT_OBJ = JSON_DETECT_OBJ;
/** ----------------------------------------------
 * Control Markers
 */
var CTRL_HEADER = 0xFF;

exports.CTRL_HEADER = CTRL_HEADER;
/** ----------------------------------------------
 * Value : Container : Dict
 */
var VAL_DICT1 = 0x10;
exports.VAL_DICT1 = VAL_DICT1;
var VAL_DICT2 = 0x11;
exports.VAL_DICT2 = VAL_DICT2;
var VAL_DICT4 = 0x12;

exports.VAL_DICT4 = VAL_DICT4;
/** ----------------------------------------------
 * Value : Container : List
 */
var VAL_LIST1 = 0x14;
exports.VAL_LIST1 = VAL_LIST1;
var VAL_LIST2 = 0x15;
exports.VAL_LIST2 = VAL_LIST2;
var VAL_LIST4 = 0x16;

exports.VAL_LIST4 = VAL_LIST4;
/** ----------------------------------------------
 * Value : Data : String
 */
var VAL_STR1 = 0x20;
exports.VAL_STR1 = VAL_STR1;
var VAL_STR2 = 0x21;
exports.VAL_STR2 = VAL_STR2;
var VAL_STR4 = 0x22;exports.VAL_STR4 = VAL_STR4;
// !

/** ----------------------------------------------
 * Value : Data : Binary
 */
var VAL_BIN1 = 0x24;
exports.VAL_BIN1 = VAL_BIN1;
var VAL_BIN2 = 0x25;
exports.VAL_BIN2 = VAL_BIN2;
var VAL_BIN4 = 0x26;

exports.VAL_BIN4 = VAL_BIN4;
/** ----------------------------------------------
 * Value : Primitive: Number
 */
var VAL_INT8 = 0x30;
exports.VAL_INT8 = VAL_INT8;
var VAL_INT16 = 0x31;
exports.VAL_INT16 = VAL_INT16;
var VAL_INT32 = 0x32;
exports.VAL_INT32 = VAL_INT32;
var VAL_INT64 = 0x33;

exports.VAL_INT64 = VAL_INT64;
var VAL_FLOAT = 0x38;
exports.VAL_FLOAT = VAL_FLOAT;
var VAL_DOUBLE = 0x39;

exports.VAL_DOUBLE = VAL_DOUBLE;
/** ----------------------------------------------
 * Value : Primitive: Null
 */
var VAL_NULL = 0x40;

exports.VAL_NULL = VAL_NULL;
/** ----------------------------------------------
 * Value : Primitive: Boolean
 */
var VAL_FALSE = 0x41;
exports.VAL_FALSE = VAL_FALSE;
var VAL_TRUE = 0x42;

exports.VAL_TRUE = VAL_TRUE;
/** ----------------------------------------------
 * Key : String
 */
var KEY_STR1 = 0xD0;
exports.KEY_STR1 = KEY_STR1;
var KEY_STR2 = 0xD1;

exports.KEY_STR2 = KEY_STR2;
/** ----------------------------------------------------------------------------
 * Variable Length Extension
 */

/** ----------------------------------------------
 * Control Markers
 */
var VARLEN_END = 0x00;

exports.VARLEN_END = VARLEN_END;
/** ----------------------------------------------
 * Varibale Length Value : Container
 */
var VAL_DICT0 = 0x13;
exports.VAL_DICT0 = VAL_DICT0;
var VAL_LIST0 = 0x17;

exports.VAL_LIST0 = VAL_LIST0;
/** ----------------------------------------------
 * Variable Length Value : Data
 */
var VAL_STR0 = 0x23;
exports.VAL_STR0 = VAL_STR0;
var VAL_BIN0 = 0x27;

exports.VAL_BIN0 = VAL_BIN0;
/** ----------------------------------------------------------------------------
 * Object Pool Extension
 */

/** ----------------------------------------------
 * Object Pool Value
 */
var POOL_VAL_GET1 = 0xE0;
exports.POOL_VAL_GET1 = POOL_VAL_GET1;
var POOL_VAL_GET2 = 0xE1;

exports.POOL_VAL_GET2 = POOL_VAL_GET2;
var POOL_VAL_SET1 = 0xE2;
exports.POOL_VAL_SET1 = POOL_VAL_SET1;
var POOL_VAL_SET2 = 0xE3;

exports.POOL_VAL_SET2 = POOL_VAL_SET2;
/** ----------------------------------------------
 * Object Pool Key
 */
var POOL_KEY_GET1 = 0xE4;
exports.POOL_KEY_GET1 = POOL_KEY_GET1;
var POOL_KEY_GET2 = 0xE5;

exports.POOL_KEY_GET2 = POOL_KEY_GET2;
var POOL_KEY_SET1 = 0xE6;
exports.POOL_KEY_SET1 = POOL_KEY_SET1;
var POOL_KEY_SET2 = 0xE7;
exports.POOL_KEY_SET2 = POOL_KEY_SET2;