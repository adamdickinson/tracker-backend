"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateGuest = exports.searchGuests = exports.restoreGuest = exports.guest = exports.deleteGuest = exports.createGuest = void 0;

var _elasticsearch = _interopRequireDefault(require("../../config/elasticsearch"));

var _pouchdb = _interopRequireDefault(require("../../config/pouchdb"));

var _uniq = _interopRequireDefault(require("lodash/uniq"));

var _v = _interopRequireDefault(require("uuid/v1"));

var _pouchdb2 = require("../../helpers/pouchdb");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const createGuest = async ({
  guest
}) => {
  const _id = `Guest:${(0, _v.default)()}`;
  await _pouchdb.default.put(_objectSpread({
    _id
  }, guest));
  return prepareGuest((await _pouchdb.default.get(_id)));
};

exports.createGuest = createGuest;

const deleteGuest = async ({
  id
}) => updateGuest(id, {
  archived: true
});

exports.deleteGuest = deleteGuest;

const guest = async ({
  id
}) => {
  if (!id.startsWith("Guest:")) return null;
  return prepareGuest((await _pouchdb.default.get(id)));
};

exports.guest = guest;

const prepareGuest = async guest => (0, _pouchdb2.unpouchDoc)(guest);

const restoreGuest = async ({
  id
}) => updateGuest(id, {
  archived: false
});

exports.restoreGuest = restoreGuest;

const searchGuests = async ({
  query
}) => {
  const response = await _elasticsearch.default.search({
    body: {
      query: {
        bool: {
          filter: {
            match_phrase_prefix: {
              "doc._id": "Guest:"
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
  const guests = response.hits.hits.length ? response.hits.hits.map(hit => hit._source.doc) : [];
  return Promise.all(guests.map(prepareGuest));
};

exports.searchGuests = searchGuests;

const updateGuest = async ({
  id,
  guest
}) => {
  await _pouchdb.default.upsert(id, latest => _objectSpread({}, latest, guest));
  return prepareGuest((await _pouchdb.default.get(id)));
};

exports.updateGuest = updateGuest;