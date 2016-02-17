"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BinarifierContext = undefined;

var _events = require("events");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Universal Binary Format
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ubf
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var BinarifierContext = exports.BinarifierContext = function (_EventEmitter) {
  _inherits(BinarifierContext, _EventEmitter);

  function BinarifierContext() {
    _classCallCheck(this, BinarifierContext);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BinarifierContext).call(this));

    _this.valPool = new Map();
    _this.keyPool = new Map();
    return _this;
  }

  return BinarifierContext;
}(_events.EventEmitter);