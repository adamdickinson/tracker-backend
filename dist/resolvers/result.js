"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.recordShootingResults = exports.recordShootingResult = exports.recordResults = exports.recordResult = exports.recordMeasurement = void 0;

var _pouchdb = _interopRequireDefault(require("../config/pouchdb"));

var _v = _interopRequireDefault(require("uuid/v1"));

var _tests = _interopRequireDefault(require("../config/tests"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const recordMeasurement = async ({
  measurement
}) => {
  const _id = `Measurement:${(0, _v.default)()}`;
  await _pouchdb.default.put(_objectSpread({
    _id
  }, measurement));
  measurement = await _pouchdb.default.get(_id);
  measurement.athlete = await _pouchdb.default.get(measurement.athlete);
  return measurement;
};

exports.recordMeasurement = recordMeasurement;

const recordResult = async ({
  result
}) => {
  const _id = `Result:${(0, _v.default)()}`;
  await _pouchdb.default.put(_objectSpread({
    _id
  }, result));
  result = await _pouchdb.default.get(_id);
  result.athlete = await _pouchdb.default.get(result.athlete);
  result.test = _tests.default.find(test => test.name == result.test);
  return result;
};

exports.recordResult = recordResult;

const recordResults = async ({
  results
}) => results.map(result => recordResult({
  result
}));

exports.recordResults = recordResults;

const recordShootingResult = async ({
  result
}) => {
  const _id = `ShootingResult:${(0, _v.default)()}`;
  await _pouchdb.default.put(_objectSpread({
    _id
  }, result));
  result = await _pouchdb.default.get(_id);
  result.athlete = await _pouchdb.default.get(result.athlete);
  result.test = _tests.default.find(test => test.name == result.test);
  return result;
};

exports.recordShootingResult = recordShootingResult;

const recordShootingResults = async ({
  results
}) => results.map(result => recordShootingResult({
  result
}));

exports.recordShootingResults = recordShootingResults;