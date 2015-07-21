define(["exports", "./markers"], function (exports, _markers) {
  /*
   * Universal Binary Format
   * Base Profile
   */
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.parseControlDirective = parseControlDirective;
  exports.parseValue = parseValue;
  exports.parseKey = parseKey;
  exports.parseLength = parseLength;
  exports.parseValueContainerDict = parseValueContainerDict;
  exports.parseValueContainerList = parseValueContainerList;

  /**
   * Base Profile : Byte Lengths
   */
  var LEN_OF_MARKER = 1;
  exports.LEN_OF_MARKER = LEN_OF_MARKER;
  var LEN_OF_SIZE1 = 1;
  exports.LEN_OF_SIZE1 = LEN_OF_SIZE1;
  var LEN_OF_SIZE2 = 1 << 1;
  exports.LEN_OF_SIZE2 = LEN_OF_SIZE2;
  var LEN_OF_SIZE4 = 1 << 2;

  exports.LEN_OF_SIZE4 = LEN_OF_SIZE4;
  /**
   * Base Profile : parseControlDirective
   */

  function parseControlDirective() {
    switch (this.readMarker()) {
      case _markers.CTRL_HEADER:
        {
          this.consume(LEN_OF_MARKER);
          return true;
        }
    }
  }

  /**
   * Base Profile : parseValue
   */

  function parseValue() {
    switch (this.readMarker()) {
      // Container : Dict ------------------------
      case _markers.VAL_DICT1:
        {
          var _length = parseLength.call(this, LEN_OF_SIZE1, LEN_OF_MARKER);
          if (_length === undefined) {
            return;
          }
          return parseValueContainerDict.call(this, _length);
        }
      case _markers.VAL_DICT2:
        {
          var _length2 = parseLength.call(this, LEN_OF_SIZE2, LEN_OF_MARKER);
          if (_length2 === undefined) {
            return;
          }
          return parseValueContainerDict.call(this, _length2);
        }
      case _markers.VAL_DICT4:
        {
          var _length3 = parseLength.call(this, LEN_OF_SIZE4, LEN_OF_MARKER);
          if (_length3 === undefined) {
            return;
          }
          return parseValueContainerDict.call(this, _length3);
        }

      // Container : List ------------------------
      case _markers.VAL_LIST1:
        {
          var _length4 = parseLength.call(this, LEN_OF_SIZE1, LEN_OF_MARKER);
          if (_length4 === undefined) {
            return;
          }
          return parseValueContainerList.call(this, _length4);
        }
      case _markers.VAL_LIST2:
        {
          var _length5 = parseLength.call(this, LEN_OF_SIZE2, LEN_OF_MARKER);
          if (_length5 === undefined) {
            return;
          }
          return parseValueContainerList.call(this, _length5);
        }
      case _markers.VAL_LIST4:
        {
          var _length6 = parseLength.call(this, LEN_OF_SIZE4, LEN_OF_MARKER);
          if (_length6 === undefined) {
            return;
          }
          return parseValueContainerList.call(this, _length6);
        }

      // Data : String ---------------------------
      case _markers.VAL_STR1:
        {
          var _length7 = parseLength.call(this, LEN_OF_SIZE1, LEN_OF_MARKER);
          if (_length7 === undefined) {
            return;
          }
          return this.consumeString(_length7);
        }
      case _markers.VAL_STR2:
        {
          var _length8 = parseLength.call(this, LEN_OF_SIZE2, LEN_OF_MARKER);
          if (_length8 === undefined) {
            return;
          }
          return this.consumeString(_length8);
        }
      case _markers.VAL_STR4:
        {
          var _length9 = parseLength.call(this, LEN_OF_SIZE4, LEN_OF_MARKER);
          if (_length9 === undefined) {
            return;
          }
          return this.consumeString(_length9);
        }

      // Data : Binary ---------------------------
      case _markers.VAL_BIN1:
        {
          var _length10 = parseLength.call(this, LEN_OF_SIZE1, LEN_OF_MARKER);
          if (_length10 === undefined) {
            return;
          }
          return this.consumeBinary(_length10);
        }
      case _markers.VAL_BIN2:
        {
          var _length11 = parseLength.call(this, LEN_OF_SIZE2, LEN_OF_MARKER);
          if (_length11 === undefined) {
            return;
          }
          return this.consumeBinary(_length11);
        }
      case _markers.VAL_BIN4:
        {
          var _length12 = parseLength.call(this, LEN_OF_SIZE4, LEN_OF_MARKER);
          if (_length12 === undefined) {
            return;
          }
          return this.consumeBinary(_length12);
        }

      // Primitive : Number ----------------------
      case _markers.VAL_INT8:
        {
          return this.consumeInt8(LEN_OF_MARKER);
        }
      case _markers.VAL_INT16:
        {
          return this.consumeInt16(LEN_OF_MARKER);
        }
      case _markers.VAL_INT32:
        {
          return this.consumeInt32(LEN_OF_MARKER);
        }
      case _markers.VAL_INT64:
        {
          return this.consumeInt64(LEN_OF_MARKER);
        }

      case _markers.VAL_FLOAT:
        {
          return this.consumeFloat(LEN_OF_MARKER);
        }
      case _markers.VAL_DOUBLE:
        {
          return this.consumeDouble(LEN_OF_MARKER);
        }

      // Primitive : Null ------------------------
      case _markers.VAL_NULL:
        {
          return this.consume(LEN_OF_MARKER, null);
        }

      // Primitive : Boolean ---------------------
      case _markers.VAL_FALSE:
        {
          return this.consume(LEN_OF_MARKER, false);
        }
      case _markers.VAL_TRUE:
        {
          return this.consume(LEN_OF_MARKER, true);
        }
    }
  }

  /**
   * Base Profile : parseKey
   */

  function parseKey() {
    switch (this.readMarker()) {
      // Key -------------------------------------
      case _markers.KEY_STR1:
        {
          var _length13 = parseLength.call(this, LEN_OF_SIZE1, LEN_OF_MARKER);
          if (_length13 === undefined) {
            return;
          }
          return this.consumeString(_length13);
        }
      case _markers.KEY_STR2:
        {
          var _length14 = parseLength.call(this, LEN_OF_SIZE2, LEN_OF_MARKER);
          if (_length14 === undefined) {
            return;
          }
          return this.consumeString(_length14);
        }
    }
  }

  /**
   * Base Profile : parseLength
   */

  function parseLength(size) {
    var relOffset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

    switch (size) {
      case LEN_OF_SIZE1:
        {
          var _length15 = this.consumeUInt8(relOffset);
          if (_length15 === undefined) {
            return;
          }
          if (this.available(_length15)) {
            return _length15;
          }
          this.rewind(LEN_OF_SIZE1 + relOffset);
          return;
        }
      case LEN_OF_SIZE2:
        {
          var _length16 = this.consumeUInt16(relOffset);
          if (_length16 === undefined) {
            return;
          }
          if (this.available(_length16)) {
            return _length16;
          }
          this.rewind(LEN_OF_SIZE2 + relOffset);
          return;
        }
      case LEN_OF_SIZE4:
        {
          var _length17 = this.consumeUInt32(relOffset);
          if (_length17 === undefined) {
            return;
          }
          if (this.available(_length17)) {
            return _length17;
          }
          this.rewind(LEN_OF_SIZE4 + relOffset);
          return;
        }
    }
  }

  /**
   * Base Profile : parseValueContainerDict
   */

  function parseValueContainerDict(length) {
    var eoc = this.offset + length;
    var dict = Object.create(null);
    while (this.offset < eoc && this.offset < this.buffer.length) {
      var key = this.parseKey();
      if (key === undefined) {
        break;
      }
      var value = this.parseValue();
      if (value === undefined) {
        break;
      }
      dict[key] = value;
    }
    this.offset = eoc;
    return dict;
  }

  /**
   * Base Profile : parseValueContainerList
   */

  function parseValueContainerList(length) {
    var eoc = this.offset + length;
    var list = [];
    while (this.offset < eoc && this.offset < this.buffer.length) {
      var value = this.parseValue();
      if (value === undefined) {
        break;
      }
      list.push(value);
    }
    this.offset = eoc;
    return list;
  }
});