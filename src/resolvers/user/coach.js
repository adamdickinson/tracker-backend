import client from "../../config/elasticsearch"
import pouchdb from "../../config/pouchdb"
import uniq from "lodash/uniq"
import uuid from "uuid/v1"
import { unpouchDoc, unpouchDocs } from "../../helpers/pouchdb"



export const coach = async ({ id }) => {
  if( !id.startsWith("Coach:") ) return null
  return prepareCoach(await pouchdb.get(id))
}



export const createCoach = async ({ coach }) => {
  const _id = `Coach:${uuid()}`
  await pouchdb.put({ _id, ...coach })
  return prepareCoach( await pouchdb.get(_id) )
}



export const deleteCoach = async ({ id }) => updateCoach(id, { archived: true })



const prepareCoach = async coach => unpouchDoc(coach)



export const restoreCoach = async ({ id }) => updateCoach(id, { archived: false })



export const searchCoaches = async ({ query }) => {
  const response = await client.search({
    body: {
      query: {
        bool: {
          filter: {
            match_phrase_prefix: { "doc._id": "Coach:" }
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

  const coaches = response.hits.hits.length
    ? response.hits.hits.map(hit => hit._source.doc)
    : []
  
  return Promise.all(coaches.map(prepareCoach))
}



export const updateCoach = async ({ id, coach }) => {
  await pouchdb.upsert(id, latest => ({ ...latest, ...coach }))
  return prepareCoach(await pouchdb.get(id))
}
