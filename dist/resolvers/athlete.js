"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findAthletes = exports.updateAthlete = exports.createAthlete = void 0;

var _elasticsearch = _interopRequireDefault(require("../config/elasticsearch"));

var _pouchdb = _interopRequireDefault(require("../config/pouchdb"));

var _v = _interopRequireDefault(require("uuid/v1"));

var _uniq = _interopRequireDefault(require("lodash/uniq"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const resolve = async docIds => {
  if (!docIds || !docIds.length) return [];
  const results = await _pouchdb.default.allDocs({
    include_docs: true,
    keys: docIds
  });
  return results.rows.map(result => result.doc);
};

const createAthlete = async ({
  athlete
}) => {
  const _id = `Athlete:${(0, _v.default)()}`;
  await _pouchdb.default.put(_objectSpread({
    _id
  }, athlete));
  athlete = await _pouchdb.default.get(_id);
  return loadGroupsForAthlete(athlete);
};

exports.createAthlete = createAthlete;

const loadGroupsForAthlete = async athlete => {
  // Fetch groups
  const groups = await _pouchdb.default.find({
    selector: {
      _id: {
        $gt: "Group:",
        $lt: "Group:\uffff"
      },
      athletes: {
        $elemMatch: {
          $eq: athlete._id
        }
      }
    }
  });
  athlete.groups = groups.docs;
  return athlete;
};

const updateAthlete = async ({
  _id,
  athlete
}) => {
  await _pouchdb.default.upsert(_id, latest => _objectSpread({}, latest, athlete));
  athlete = await _pouchdb.default.get(_id);
  return loadGroupsForAthlete(athlete);
};

exports.updateAthlete = updateAthlete;

const findAthletes = async ({
  query
}) => {
  const response = await _elasticsearch.default.search({
    body: {
      query: {
        bool: {
          filter: {
            match_phrase_prefix: {
              "doc._id": "Athlete:"
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
  return response.hits.hits.length ? response.hits.hits.map(hit => hit._source.doc) : [];
};

exports.findAthletes = findAthletes;