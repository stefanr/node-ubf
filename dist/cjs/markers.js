"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Universal Binary Format
 * @module ubf
 */

/*eslint-disable no-multi-spaces */

/**
 * Control Markers
 */
var CTRL_HEADER = exports.CTRL_HEADER = 0xFF;

/**
 * Reserved Markers
 * JSON Detection
 */
var JSON_DETECT_ARR = exports.JSON_DETECT_ARR = 0x5B;
var JSON_DETECT_OBJ = exports.JSON_DETECT_OBJ = 0x7B;

/**
 * Base Module
 */

/**
 * Base / Value : Dict
 */
var VAL_DICT1 = exports.VAL_DICT1 = 0x10;
var VAL_DICT2 = exports.VAL_DICT2 = 0x11;
var VAL_DICT4 = exports.VAL_DICT4 = 0x12;

/**
 * Base / Value : List
 */
var VAL_LIST1 = exports.VAL_LIST1 = 0x14;
var VAL_LIST2 = exports.VAL_LIST2 = 0x15;
var VAL_LIST4 = exports.VAL_LIST4 = 0x16;

/**
 * Base / Value : String
 */
var VAL_STR1 = exports.VAL_STR1 = 0x20;
var VAL_STR2 = exports.VAL_STR2 = 0x21;
var VAL_STR4 = exports.VAL_STR4 = 0x22;

/**
 * Base / Value : Binary
 */
var VAL_BIN1 = exports.VAL_BIN1 = 0x24;
var VAL_BIN2 = exports.VAL_BIN2 = 0x25;
var VAL_BIN4 = exports.VAL_BIN4 = 0x26;

/**
 * Base / Value : Number
 */
var VAL_INT8 = exports.VAL_INT8 = 0x30;
var VAL_INT16 = exports.VAL_INT16 = 0x31;
var VAL_INT32 = exports.VAL_INT32 = 0x32;
var VAL_INT64 = exports.VAL_INT64 = 0x33;
var VAL_FLOAT = exports.VAL_FLOAT = 0x38;
var VAL_DOUBLE = exports.VAL_DOUBLE = 0x39;

/**
 * Base / Value : Boolean
 */
var VAL_FALSE = exports.VAL_FALSE = 0x40;
var VAL_TRUE = exports.VAL_TRUE = 0x41;

/**
 * Base / Value : Null
 */
var VAL_NULL = exports.VAL_NULL = 0x42;

/**
 * Base / Key : String
 */
var KEY_STR1 = exports.KEY_STR1 = 0xE0;
var KEY_STR2 = exports.KEY_STR2 = 0xE1;

/**
 * Chunks Module
 */

/**
 * Chunks / Control Markers
 */
var CHUNK_END = exports.CHUNK_END = 0x00;

/**
 * Chunks / Value : Dict & List
 */
var VAL_DICTX = exports.VAL_DICTX = 0x1C;
var VAL_LISTX = exports.VAL_LISTX = 0x1D;

/**
 * Chunks / Value : String & Binary
 */
var VAL_STRX = exports.VAL_STRX = 0x2C;
var VAL_BINX = exports.VAL_BINX = 0x2D;

/**
 * Constant Pool Module
 */

/**
 * Constant Pool / Value
 */
var VAL_POOL_GET1 = exports.VAL_POOL_GET1 = 0xC0;
var VAL_POOL_GET2 = exports.VAL_POOL_GET2 = 0xC1;

var VAL_POOL_SET1 = exports.VAL_POOL_SET1 = 0xC2;
var VAL_POOL_SET2 = exports.VAL_POOL_SET2 = 0xC3;

/**
 * Constant Pool / Key
 */
var KEY_POOL_GET1 = exports.KEY_POOL_GET1 = 0xC4;
var KEY_POOL_GET2 = exports.KEY_POOL_GET2 = 0xC5;

var KEY_POOL_SET1 = exports.KEY_POOL_SET1 = 0xC6;
var KEY_POOL_SET2 = exports.KEY_POOL_SET2 = 0xC7;