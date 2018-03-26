"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.recordMeasurementResult = exports.measurementResult = void 0;

var _pouchdb = _interopRequireDefault(require("../../config/pouchdb"));

var _v = _interopRequireDefault(require("uuid/v1"));

var _index = require("./index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const measurementResult = async ({
  id
}) => {
  if (!id.startsWith("MeasurementResult:")) return null;
  return (0, _index.prepareResult)((await _pouchdb.default.get(id)));
};

exports.measurementResult = measurementResult;

const recordMeasurementResult = async ({
  result
}) => {
  const _id = `MeasurementResult:${(0, _v.default)()}`;
  await _pouchdb.default.put(_objectSpread({
    _id
  }, result));
  return (0, _index.prepareResult)((await _pouchdb.default.get(_id)));
};

exports.recordMeasurementResult = recordMeasurementResult;