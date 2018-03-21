"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findGroups = exports.updateGroup = exports.createGroup = exports.removeAthleteFromGroup = exports.addAthleteToGroup = void 0;

var _elasticsearch = _interopRequireDefault(require("../config/elasticsearch"));

var _flatMap = _interopRequireDefault(require("lodash/flatMap"));

var _keyBy = _interopRequireDefault(require("lodash/keyBy"));

var _pouchdb = _interopRequireDefault(require("../config/pouchdb"));

var _uniq = _interopRequireDefault(require("lodash/uniq"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const addAthleteToGroup = async ({
  athlete,
  group
}) => {
  await _pouchdb.default.upsert(group, latest => _objectSpread({}, latest, {
    athletes: (0, _uniq.default)([...latest.athletes, athlete])
  }));
  group = await _pouchdb.default.get(group);
  const athleteRows = await _pouchdb.default.allDocs({
    include_docs: true,
    keys: group.athletes
  });
  const athletes = athleteRows.rows.map(row => row.doc);
  return _objectSpread({}, group, {
    athletes
  });
};

exports.addAthleteToGroup = addAthleteToGroup;

const removeAthleteFromGroup = async ({
  athlete,
  group
}) => {
  await _pouchdb.default.upsert(group, latest => _objectSpread({}, latest, {
    athletes: latest.athletes.filter(id => id != athlete)
  }));
  group = await _pouchdb.default.get(group);
  const athleteRows = await _pouchdb.default.allDocs({
    include_docs: true,
    keys: group.athletes
  });
  const athletes = athleteRows.rows.map(row => row.doc);
  return _objectSpread({}, group, {
    athletes
  });
};

exports.removeAthleteFromGroup = removeAthleteFromGroup;

const createGroup = async ({
  group
}) => {
  const _id = `Group:${uuid()}`;
  await _pouchdb.default.put(_objectSpread({
    _id
  }, group));
  return _pouchdb.default.get(_id);
};

exports.createGroup = createGroup;

const updateGroup = async ({
  _id,
  group
}) => {
  await _pouchdb.default.upsert(_id, latest => _objectSpread({}, latest, group));
  return _pouchdb.default.get(_id);
};

exports.updateGroup = updateGroup;

const findGroups = async ({
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
  let groups = response.hits.hits.length ? response.hits.hits.map(hit => hit._source.doc) : [];
  const athleteIds = (0, _uniq.default)((0, _flatMap.default)(groups, group => group.athletes).filter(a => !!a));
  const athletes = await _pouchdb.default.allDocs({
    include_docs: true,
    keys: athleteIds
  });
  const athletesById = (0, _keyBy.default)(athletes.rows.map(athlete => athlete.doc), "_id");
  groups = groups.map(group => {
    if (!group.athletes) return group;
    return _objectSpread({}, group, {
      athletes: group.athletes.map(id => athletesById[id])
    });
  });
  return groups;
};

exports.findGroups = findGroups;