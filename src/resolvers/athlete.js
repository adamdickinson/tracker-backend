import client from "../config/elasticsearch"
import pouchdb from "../config/pouchdb"
import uuid from "uuid/v1"
import uniq from "lodash/uniq"



const resolve = async docIds => {
  if( !docIds || !docIds.length ) return []
  const results = await pouchdb.allDocs({ include_docs: true, keys: docIds })
  return results.rows.map(result => result.doc)
}



export const createAthlete = async ({ athlete }) => {
  const _id = `Athlete:${uuid()}`
  await pouchdb.put({ _id, ...athlete })
  athlete = await pouchdb.get(_id)
  return loadGroupsForAthlete(athlete)
}



const loadGroupsForAthlete = async athlete => {

  // Fetch groups
  const groups = await pouchdb.find({ selector: {
    _id: { $gt: "Group:", $lt: "Group:\uffff" },
    athletes: { $elemMatch: { $eq: athlete._id } }
  } })

  athlete.groups = groups.docs
  return athlete
}



export const updateAthlete = async ({ _id, athlete }) => {
  await pouchdb.upsert(_id, latest => ({ ...latest, ...athlete }))
  athlete = await pouchdb.get(_id)
  return loadGroupsForAthlete(athlete)
}



export const findAthletes = async ({ query }) => {
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

  return response.hits.hits.length
    ? response.hits.hits.map(hit => hit._source.doc)
    : []
}
