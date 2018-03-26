import client from "../../config/elasticsearch"
import pouchdb from "../../config/pouchdb"
import uniq from "lodash/uniq"
import uuid from "uuid/v1"
import { unpouchDoc, unpouchDocs } from "../../config/pouchdb"



export const athlete = async ({ id }) => {
  if( !id.startsWith("Athlete:") ) return null
  return prepareAthlete(await pouchdb.get(id))
}



export const createAthlete = async ({ athlete }) => {
  const _id = `Athlete:${uuid()}`
  await pouchdb.put({ _id, ...athlete })
  return prepareAthlete( await pouchdb.get(_id) )
}



export const deleteAthlete = async ({ id }) => updateAthlete(id, { archived: true })



const prepareAthlete = async athlete => {
  athlete = unpouchDoc(athlete)

  // Load groups
  const groups = await pouchdb.find({ selector: {
    _id: { $gt: "Group:", $lt: "Group:\uffff" },
    athletes: { $elemMatch: { $eq: athlete.id } }
  } })

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
