"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateCoach = exports.searchCoaches = exports.restoreCoach = exports.deleteCoach = exports.createCoach = exports.coach = void 0;

var _elasticsearch = _interopRequireDefault(require("../../config/elasticsearch"));

var _pouchdb = _interopRequireDefault(require("../../config/pouchdb"));

var _uniq = _interopRequireDefault(require("lodash/uniq"));

var _v = _interopRequireDefault(require("uuid/v1"));

var _pouchdb2 = require("../../helpers/pouchdb");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const coach = async ({
  id
}) => {
  if (!id.startsWith("Coach:")) return null;
  return prepareCoach((await _pouchdb.default.get(id)));
};

exports.coach = coach;

const createCoach = async ({
  coach
}) => {
  const _id = `Coach:${(0, _v.default)()}`;
  await _pouchdb.default.put(_objectSpread({
    _id
  }, coach));
  return prepareCoach((await _pouchdb.default.get(_id)));
};

exports.createCoach = createCoach;

const deleteCoach = async ({
  id
}) => updateCoach(id, {
  archived: true
});

exports.deleteCoach = deleteCoach;

const prepareCoach = async coach => (0, _pouchdb2.unpouchDoc)(coach);

const restoreCoach = async ({
  id
}) => updateCoach(id, {
  archived: false
});

exports.restoreCoach = restoreCoach;

const searchCoaches = async ({
  query
}) => {
  const response = await _elasticsearch.default.search({
    body: {
      query: {
        bool: {
          filter: {
            match_phrase_prefix: {
              "doc._id": "Coach:"
            }
          },
          must: {
            multi_match: {
              query: `*${query}*`,
              type: "phrase_prefix",
              fields: ["doc.firstName", "doc.lastName"]
            }
          }
        }
      }
    }
  });
  const coaches = response.hits.hits.length ? response.hits.hits.map(hit => hit._source.doc) : [];
  return Promise.all(coaches.map(prepareCoach));
};

exports.searchCoaches = searchCoaches;

const updateCoach = async ({
  id,
  coach
}) => {
  await _pouchdb.default.upsert(id, latest => _objectSpread({}, latest, coach));
  return prepareCoach((await _pouchdb.default.get(id)));
};

exports.updateCoach = updateCoach;