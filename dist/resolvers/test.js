"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.test = void 0;

var _tests = _interopRequireDefault(require("../config/tests"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const test = ({
  name
}) => _tests.default.find(test => test.name == name);

exports.test = test;