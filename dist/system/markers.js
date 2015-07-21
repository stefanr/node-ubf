System.register([], function (_export) {
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

  var JSON_DETECT_STR, JSON_DETECT_ARR, JSON_DETECT_OBJ, CTRL_HEADER, VAL_DICT1, VAL_DICT2, VAL_DICT4, VAL_LIST1, VAL_LIST2, VAL_LIST4, VAL_STR1, VAL_STR2, VAL_STR4, VAL_BIN1, VAL_BIN2, VAL_BIN4, VAL_INT8, VAL_INT16, VAL_INT32, VAL_INT64, VAL_FLOAT, VAL_DOUBLE, VAL_NULL, VAL_FALSE, VAL_TRUE, KEY_STR1, KEY_STR2, VARLEN_END, VAL_DICT0, VAL_LIST0, VAL_STR0, VAL_BIN0, POOL_VAL_GET1, POOL_VAL_GET2, POOL_VAL_SET1, POOL_VAL_SET2, POOL_KEY_GET1, POOL_KEY_GET2, POOL_KEY_SET1, POOL_KEY_SET2;
  return {
    setters: [],
    execute: function () {
      JSON_DETECT_STR = 0x22;

      _export("JSON_DETECT_STR", JSON_DETECT_STR);

      JSON_DETECT_ARR = 0x5B;

      _export("JSON_DETECT_ARR", JSON_DETECT_ARR);

      JSON_DETECT_OBJ = 0x7B;

      _export("JSON_DETECT_OBJ", JSON_DETECT_OBJ);

      /** ----------------------------------------------
       * Control Markers
       */
      CTRL_HEADER = 0xFF;

      _export("CTRL_HEADER", CTRL_HEADER);

      /** ----------------------------------------------
       * Value : Container : Dict
       */
      VAL_DICT1 = 0x10;

      _export("VAL_DICT1", VAL_DICT1);

      VAL_DICT2 = 0x11;

      _export("VAL_DICT2", VAL_DICT2);

      VAL_DICT4 = 0x12;

      _export("VAL_DICT4", VAL_DICT4);

      /** ----------------------------------------------
       * Value : Container : List
       */
      VAL_LIST1 = 0x14;

      _export("VAL_LIST1", VAL_LIST1);

      VAL_LIST2 = 0x15;

      _export("VAL_LIST2", VAL_LIST2);

      VAL_LIST4 = 0x16;

      _export("VAL_LIST4", VAL_LIST4);

      /** ----------------------------------------------
       * Value : Data : String
       */
      VAL_STR1 = 0x20;

      _export("VAL_STR1", VAL_STR1);

      VAL_STR2 = 0x21;

      _export("VAL_STR2", VAL_STR2);

      VAL_STR4 = 0x22;

      _export("VAL_STR4", VAL_STR4);

      // !

      /** ----------------------------------------------
       * Value : Data : Binary
       */
      VAL_BIN1 = 0x24;

      _export("VAL_BIN1", VAL_BIN1);

      VAL_BIN2 = 0x25;

      _export("VAL_BIN2", VAL_BIN2);

      VAL_BIN4 = 0x26;

      _export("VAL_BIN4", VAL_BIN4);

      /** ----------------------------------------------
       * Value : Primitive: Number
       */
      VAL_INT8 = 0x30;

      _export("VAL_INT8", VAL_INT8);

      VAL_INT16 = 0x31;

      _export("VAL_INT16", VAL_INT16);

      VAL_INT32 = 0x32;

      _export("VAL_INT32", VAL_INT32);

      VAL_INT64 = 0x33;

      _export("VAL_INT64", VAL_INT64);

      VAL_FLOAT = 0x38;

      _export("VAL_FLOAT", VAL_FLOAT);

      VAL_DOUBLE = 0x39;

      _export("VAL_DOUBLE", VAL_DOUBLE);

      /** ----------------------------------------------
       * Value : Primitive: Null
       */
      VAL_NULL = 0x40;

      _export("VAL_NULL", VAL_NULL);

      /** ----------------------------------------------
       * Value : Primitive: Boolean
       */
      VAL_FALSE = 0x41;

      _export("VAL_FALSE", VAL_FALSE);

      VAL_TRUE = 0x42;

      _export("VAL_TRUE", VAL_TRUE);

      /** ----------------------------------------------
       * Key : String
       */
      KEY_STR1 = 0xD0;

      _export("KEY_STR1", KEY_STR1);

      KEY_STR2 = 0xD1;

      _export("KEY_STR2", KEY_STR2);

      /** ----------------------------------------------------------------------------
       * Variable Length Extension
       */

      /** ----------------------------------------------
       * Control Markers
       */
      VARLEN_END = 0x00;

      _export("VARLEN_END", VARLEN_END);

      /** ----------------------------------------------
       * Varibale Length Value : Container
       */
      VAL_DICT0 = 0x13;

      _export("VAL_DICT0", VAL_DICT0);

      VAL_LIST0 = 0x17;

      _export("VAL_LIST0", VAL_LIST0);

      /** ----------------------------------------------
       * Variable Length Value : Data
       */
      VAL_STR0 = 0x23;

      _export("VAL_STR0", VAL_STR0);

      VAL_BIN0 = 0x27;

      _export("VAL_BIN0", VAL_BIN0);

      /** ----------------------------------------------------------------------------
       * Object Pool Extension
       */

      /** ----------------------------------------------
       * Object Pool Value
       */
      POOL_VAL_GET1 = 0xE0;

      _export("POOL_VAL_GET1", POOL_VAL_GET1);

      POOL_VAL_GET2 = 0xE1;

      _export("POOL_VAL_GET2", POOL_VAL_GET2);

      POOL_VAL_SET1 = 0xE2;

      _export("POOL_VAL_SET1", POOL_VAL_SET1);

      POOL_VAL_SET2 = 0xE3;

      _export("POOL_VAL_SET2", POOL_VAL_SET2);

      /** ----------------------------------------------
       * Object Pool Key
       */
      POOL_KEY_GET1 = 0xE4;

      _export("POOL_KEY_GET1", POOL_KEY_GET1);

      POOL_KEY_GET2 = 0xE5;

      _export("POOL_KEY_GET2", POOL_KEY_GET2);

      POOL_KEY_SET1 = 0xE6;

      _export("POOL_KEY_SET1", POOL_KEY_SET1);

      POOL_KEY_SET2 = 0xE7;

      _export("POOL_KEY_SET2", POOL_KEY_SET2);
    }
  };
});