"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.host = void 0;

var _elasticsearch = require("elasticsearch");

const host = "localhost:9200";
exports.host = host;

var _default = new _elasticsearch.Client({
  host
});

exports.default = _default;