"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateAthlete = exports.searchAthletes = exports.restoreAthlete = exports.deleteAthlete = exports.createAthlete = exports.allAthletesReports = exports.athletesReports = exports.athletes = exports.athlete = void 0;

var _elasticsearch = _interopRequireDefault(require("../../config/elasticsearch"));

var _keyBy = _interopRequireDefault(require("lodash/keyBy"));

var _moment = _interopRequireDefault(require("moment"));

var _pouchdb = _interopRequireDefault(require("../../config/pouchdb"));

var _uniq = _interopRequireDefault(require("lodash/uniq"));

var _v = _interopRequireDefault(require("uuid/v1"));

var _camelcase = _interopRequireDefault(require("camelcase"));

var _pouchdb2 = require("../../helpers/pouchdb");

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

const athletes = async ({
  id
}) => {
  const allAthletes = await _pouchdb.default.allDocs({
    startkey: "Athlete:",
    endkey: "Athlete:\uffff",
    include_docs: true
  });
  const athletes = await Promise.all(allAthletes.rows.map(row => prepareAthlete(row.doc)));
  return athletes.sort((a, b) => a.firstName.localeCompare(b.firstName) || a.lastName.localeCompare(b.lastName));
};

exports.athletes = athletes;

const athletesReports = async ({
  ids
}) => {
  const results = await _pouchdb.default.allDocs({
    keys: ids,
    include_docs: true
  });
  const athletes = results.rows.map(row => row.doc);
  return getAthletesReports(athletes);
};

exports.athletesReports = athletesReports;

const allAthletesReports = async () => {
  const results = await _pouchdb.default.allDocs({
    startkey: "Athlete:",
    endkey: "Athlete:\uffff",
    include_docs: true
  });
  const athletes = results.rows.map(row => row.doc);
  return getAthletesReports(athletes);
};

exports.allAthletesReports = allAthletesReports;

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

const getAthletesReports = async athletes => {
  // Build final reports structure
  const reports = {};

  for (let athlete of athletes) reports[athlete._id] = {
    athlete,
    results: {}
  };

  const types = {
    MeasurementResult: {
      getKey: result => [result.athlete._id, result.test, result.specId].join("|"),
      setResult: (result, results) => results[(0, _camelcase.default)(result.specId)] = result.value
    },
    TimeResult: {
      getKey: result => [result.athlete._id, result.test].join("|"),
      setResult: (result, results) => results[(0, _camelcase.default)(result.test.split(":", 2)[1])] = (result.time / 1000).toFixed(3)
    },
    StageShuttleResult: {
      getKey: result => [result.athlete._id, result.test].join("|"),
      setResult: (result, results) => results[(0, _camelcase.default)(result.test.split(":", 2)[1])] = `${result.stage}.${result.shuttle}`
    }
  };

  for (let prefix of Object.keys(types)) {
    let {
      getKey,
      setResult
    } = types[prefix];
    let rawResults = await getAthletesResults(athletes, prefix);
    let results = {};

    for (let result of rawResults) {
      const key = getKey(result);
      if (!(key in results) || result.date > results[key].date) results[key] = result;
    }

    for (let result of Object.values(results)) setResult(result, reports[result.athlete._id].results);
  }

  return Object.values(reports);
};

const getAthletesResults = async (athletes, resultPrefix) => {
  const athleteIds = athletes.map(athlete => athlete._id);
  const results = (await _pouchdb.default.find({
    selector: {
      _id: {
        $gt: `${resultPrefix}:`,
        $lt: `${resultPrefix}:\uffff`
      },
      athlete: {
        $in: athleteIds
      }
    }
  })).docs;
  athletes = (0, _keyBy.default)(athletes, "_id");
  return results.map(result => _objectSpread({}, result, {
    athlete: athletes[result.athlete]
  }));
};

const prepareAthlete = async athlete => {
  athlete = (0, _pouchdb2.unpouchDoc)(athlete); // Load groups

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
  athlete.age = (0, _moment.default)().diff((0, _moment.default)(athlete.dateOfBirth), "years");
  athlete.groups = (0, _pouchdb2.unpouchDocs)(groups.docs);
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