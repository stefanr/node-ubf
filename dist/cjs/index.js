/*
 * Universal Binary Format
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopExportWildcard(obj, defaults) { var newObj = defaults({}, obj); delete newObj["default"]; return newObj; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

var _context = require("./context");

_defaults(exports, _interopExportWildcard(_context, _defaults));

var _parser = require("./parser");

_defaults(exports, _interopExportWildcard(_parser, _defaults));

var _binarifier = require("./binarifier");

_defaults(exports, _interopExportWildcard(_binarifier, _defaults));

var _helpers = require("./helpers");

_defaults(exports, _interopExportWildcard(_helpers, _defaults));