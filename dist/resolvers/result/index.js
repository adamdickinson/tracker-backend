"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.prepareResult = void 0;

var _tests = _interopRequireDefault(require("../../config/tests"));

var _pouchdb = require("../../helpers/pouchdb");

var measurement = _interopRequireWildcard(require("./measurement"));

var shooting = _interopRequireWildcard(require("./shooting"));

var split = _interopRequireWildcard(require("./split"));

var stageShuttle = _interopRequireWildcard(require("./stageShuttle"));

var time = _interopRequireWildcard(require("./time"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const prepareResult = async result => {
  result.test = (0, _pouchdb.unpouchDoc)(_tests.default.find(test => test.id == result.test));
  return (0, _pouchdb.unpouchDoc)(result);
};

exports.prepareResult = prepareResult;

var _default = _objectSpread({}, measurement, shooting, split, stageShuttle, time);

exports.default = _default;