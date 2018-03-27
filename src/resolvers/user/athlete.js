import client from "../../config/elasticsearch"
import keyBy from "lodash/keyBy"
import moment from "moment"
import pouchdb from "../../config/pouchdb"
import uniq from "lodash/uniq"
import uuid from "uuid/v1"
import camelCase from "camelcase"
import { unpouchDoc, unpouchDocs } from "../../helpers/pouchdb"



export const athlete = async ({ id }) => {
  if( !id.startsWith("Athlete:") ) return null
  return prepareAthlete(await pouchdb.get(id))
}



export const athletes = async ({ id }) => {
  const allAthletes = await pouchdb.allDocs({ startkey: "Athlete:", endkey: "Athlete:\uffff", include_docs: true })
  const athletes = await Promise.all(allAthletes.rows.map(row => prepareAthlete(row.doc)))
  return athletes.sort((a, b) => a.firstName.localeCompare(b.firstName) || a.lastName.localeCompare(b.lastName))
}



export const athletesReports = async ({ ids }) => {
  const results = await pouchdb.allDocs({ keys: ids, include_docs: true })
  const athletes = results.rows.map(row => row.doc)
  return getAthletesReports(athletes)
}



export const allAthletesReports = async () => {
  const results = await pouchdb.allDocs({ startkey: "Athlete:", endkey: "Athlete:\uffff", include_docs: true })
  const athletes = results.rows.map(row => row.doc)
  return getAthletesReports(athletes)
}



export const createAthlete = async ({ athlete }) => {
  const _id = `Athlete:${uuid()}`
  await pouchdb.put({ _id, ...athlete })
  return prepareAthlete( await pouchdb.get(_id) )
}



export const deleteAthlete = async ({ id }) => updateAthlete(id, { archived: true })



const getAthletesReports = async athletes => {

  // Build final reports structure
  const reports = {}
  for( let athlete of athletes )
    reports[athlete._id] = { athlete, results: {} }



  const types = {
    MeasurementResult: {
      getKey: result => [result.athlete._id, result.test, result.specId].join("|"),
      setResult: (result, results) => results[camelCase(result.specId)] = result.value
    },

    TimeResult: {
      getKey: result => [result.athlete._id, result.test].join("|"),
      setResult: (result, results) => results[camelCase(result.test.split(":", 2)[1])] = (result.time / 1000).toFixed(3)
    },

    StageShuttleResult: {
      getKey: result => [result.athlete._id, result.test].join("|"),
      setResult: (result, results) => results[camelCase(result.test.split(":", 2)[1])] = `${result.stage}.${result.shuttle}`
    }

  }


  for( let prefix of Object.keys(types) ) {
    let { getKey, setResult } = types[prefix]
    let rawResults = await getAthletesResults(athletes, prefix)
    let results = {}

    for( let result of rawResults ) {
      const key = getKey(result)
      if( !(key in results) || result.date > results[key].date )
        results[key] = result
    }

    for( let result of Object.values(results) )
      setResult(result, reports[result.athlete._id].results)
  }

  return Object.values(reports)
}



const getAthletesResults = async (athletes, resultPrefix) => {
  const athleteIds = athletes.map(athlete => athlete._id)
  const results = (await pouchdb.find({
    selector: {
      _id: { $gt: `${resultPrefix}:`, $lt: `${resultPrefix}:\uffff` },
      athlete: { $in: athleteIds }
    }
  })).docs

  athletes = keyBy(athletes, "_id")
  return results.map(result => ({ ...result, athlete: athletes[result.athlete] }))
}



const prepareAthlete = async athlete => {
  athlete = unpouchDoc(athlete)

  // Load groups
  const groups = await pouchdb.find({ selector: {
    _id: { $gt: "Group:", $lt: "Group:\uffff" },
    athletes: { $elemMatch: { $eq: athlete.id } }
  } })

  athlete.age = moment().diff(moment(athlete.dateOfBirth), "years")
  athlete.groups = unpouchDocs(groups.docs)
  return athlete
}



export const restoreAthlete = async ({ id }) => updateAthlete(id, { archived: false })



export const searchAthletes = async ({ query }) => {
  const response = await client.search({
    body: {
      query: {
        bool: {
          filter: {
            match_phrase_prefix: { "doc._id": "Athlete:" }
          },
          must: {
            multi_match: {
              query:  `*${query}*`,
              type:   "phrase_prefix",
              fields: ["doc.firstName", "doc.lastName"]
            }
          }
        }
      }
    }
  })

  const athletes = response.hits.hits.length
    ? response.hits.hits.map(hit => hit._source.doc)
    : []
  
  return Promise.all(athletes.map(prepareAthlete))
}



export const updateAthlete = async ({ id, athlete }) => {
  await pouchdb.upsert(id, latest => ({ ...latest, ...athlete }))
  return prepareAthlete(await pouchdb.get(id))
}
