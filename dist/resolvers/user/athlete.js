"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateAthlete = exports.searchAthletes = exports.restoreAthlete = exports.deleteAthlete = exports.createAthlete = exports.athlete = void 0;

var _elasticsearch = _interopRequireDefault(require("../../config/elasticsearch"));

var _pouchdb = _interopRequireWildcard(require("../../config/pouchdb"));

var _uniq = _interopRequireDefault(require("lodash/uniq"));

var _v = _interopRequireDefault(require("uuid/v1"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const athlete = async ({
  id
}) => {
  if (!id.startsWith("Athlete:")) return null;
  return prepareAthlete((await _pouchdb.default.get(id)));
};

exports.athlete = athlete;

const createAthlete = async ({
  athlete
}) => {
  const _id = `Athlete:${(0, _v.default)()}`;
  await _pouchdb.default.put(_objectSpread({
    _id
  }, athlete));
  return prepareAthlete((await _pouchdb.default.get(_id)));
};

exports.createAthlete = createAthlete;

const deleteAthlete = async ({
  id
}) => updateAthlete(id, {
  archived: true
});

exports.deleteAthlete = deleteAthlete;

const prepareAthlete = async athlete => {
  athlete = (0, _pouchdb.unpouchDoc)(athlete); // Load groups

  const groups = await _pouchdb.default.find({
    selector: {
      _id: {
        $gt: "Group:",
        $lt: "Group:\uffff"
      },
      athletes: {
        $elemMatch: {
          $eq: athlete.id
        }
      }
    }
  });
  athlete.groups = (0, _pouchdb.unpouchDocs)(groups.docs);
  return athlete;
};

const restoreAthlete = async ({
  id
}) => updateAthlete(id, {
  archived: false
});

exports.restoreAthlete = restoreAthlete;

const searchAthletes = async ({
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
  const athletes = response.hits.hits.length ? response.hits.hits.map(hit => hit._source.doc) : [];
  return Promise.all(athletes.map(prepareAthlete));
};

exports.searchAthletes = searchAthletes;

const updateAthlete = async ({
  id,
  athlete
}) => {
  await _pouchdb.default.upsert(id, latest => _objectSpread({}, latest, athlete));
  return prepareAthlete((await _pouchdb.default.get(id)));
};

exports.updateAthlete = updateAthlete;