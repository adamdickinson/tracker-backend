"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _pouchdb = _interopRequireDefault(require("pouchdb"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_pouchdb.default.plugin(require("pouchdb-upsert"));

_pouchdb.default.plugin(require("pouchdb-find"));

var _default = new _pouchdb.default("http://localhost:7984/central");

exports.default = _default;