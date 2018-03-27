"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateGroup = exports.searchGroups = exports.removeAthleteFromGroup = exports.groups = exports.group = exports.deleteGroup = exports.createGroup = exports.addAthleteToGroup = void 0;

var _elasticsearch = _interopRequireDefault(require("../config/elasticsearch"));

var _flatMap = _interopRequireDefault(require("lodash/flatMap"));

var _keyBy = _interopRequireDefault(require("lodash/keyBy"));

var _pouchdb = _interopRequireDefault(require("../config/pouchdb"));

var _uniq = _interopRequireDefault(require("lodash/uniq"));

var _v = _interopRequireDefault(require("uuid/v1"));

var _moment = _interopRequireDefault(require("moment"));

var _pouchdb2 = require("../helpers/pouchdb");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const addAthleteToGroup = async ({
  athlete,
  group
}) => {
  await _pouchdb.default.upsert(group, latest => _objectSpread({}, latest, {
    athletes: latest.athletes ? (0, _uniq.default)([...latest.athletes, athlete]) : [athlete]
  }));
  group = await _pouchdb.default.get(group);
  return prepareGroup(group);
};

exports.addAthleteToGroup = addAthleteToGroup;

const createGroup = async ({
  group
}) => {
  const _id = `Group:${(0, _v.default)()}`;
  await _pouchdb.default.put(_objectSpread({
    _id
  }, group));
  return prepareGroup((await _pouchdb.default.get(_id)));
};

exports.createGroup = createGroup;

const deleteGroup = async ({
  id
}) => {
  if (!id.startsWith("Group:")) return null;
  const group = await _pouchdb.default.get(id);
  await _pouchdb.default.remove(group);
  return prepareGroup(group);
};

exports.deleteGroup = deleteGroup;

const group = async ({
  id
}) => {
  if (!id.startsWith("Group:")) return null;
  return prepareGroup((await _pouchdb.default.get(id)));
};

exports.group = group;

const groups = async ({
  id
}) => {
  const allGroups = await _pouchdb.default.allDocs({
    startkey: "Group:",
    endkey: "Group:\uffff",
    include_docs: true
  });
  return allGroups.rows.map(row => prepareGroup(row.doc));
};

exports.groups = groups;

const prepareGroup = async group => {
  // Resolve athletes
  if (group.athletes) {
    const athleteRows = await _pouchdb.default.allDocs({
      include_docs: true,
      keys: group.athletes
    });
    const athletes = athleteRows.rows.map(row => row.doc);
    athletes && athletes.map(athlete => _objectSpread({}, athlete, {
      age: (0, _moment.default)().diff((0, _moment.default)(athlete.dateOfBirth), "years")
    }));
    group.athletes = (0, _pouchdb2.unpouchDocs)(athletes);
  } else group.athletes = []; // Tidy doc


  return (0, _pouchdb2.unpouchDoc)(group);
};

const removeAthleteFromGroup = async ({
  athlete,
  group
}) => {
  await _pouchdb.default.upsert(group, latest => _objectSpread({}, latest, {
    athletes: latest.athletes.filter(id => id != athlete)
  }));
  group = await _pouchdb.default.get(group);
  return prepareGroup(group);
};

exports.removeAthleteFromGroup = removeAthleteFromGroup;

const searchGroups = async ({
  query
}) => {
  const response = await _elasticsearch.default.search({
    body: {
      query: {
        bool: {
          filter: {
            match_phrase_prefix: {
              "doc._id": "Group:"
            }
          },
          must: {
            multi_match: {
              query: `*${query}*`,
              type: "phrase_prefix",
              fields: ["doc.name"]
            }
          }
        }
      }
    }
  });
  const groups = response.hits.hits.length ? response.hits.hits.map(hit => hit._source.doc) : [];
  return Promise.all(groups.map(prepareGroup));
};

exports.searchGroups = searchGroups;

const updateGroup = async ({
  _id,
  group
}) => {
  await _pouchdb.default.upsert(_id, latest => _objectSpread({}, latest, group));
  return prepareGroup((await _pouchdb.default.get(_id)));
};

exports.updateGroup = updateGroup;