"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.test = void 0;

var _tests = _interopRequireDefault(require("../config/tests"));

var _pouchdb = require("../helpers/pouchdb");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const test = ({
  id
}) => (0, _pouchdb.unpouchDoc)(_tests.default.find(test => test._id == id));

exports.test = test;