import client from "../../config/elasticsearch"
import pouchdb from "../../config/pouchdb"
import uniq from "lodash/uniq"
import uuid from "uuid/v1"
import { unpouchDoc, unpouchDocs } from "../../helpers/pouchdb"



export const createGuest = async ({ guest }) => {
  const _id = `Guest:${uuid()}`
  await pouchdb.put({ _id, ...guest })
  return prepareGuest( await pouchdb.get(_id) )
}



export const deleteGuest = async ({ id }) => updateGuest(id, { archived: true })



export const guest = async ({ id }) => {
  if( !id.startsWith("Guest:") ) return null
  return prepareGuest(await pouchdb.get(id))
}


const prepareGuest = async guest => unpouchDoc(guest)



export const restoreGuest = async ({ id }) => updateGuest(id, { archived: false })



export const searchGuests = async ({ query }) => {
  const response = await client.search({
    body: {
      query: {
        bool: {
          filter: {
            match_phrase_prefix: { "doc._id": "Guest:" }
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

  const guests = response.hits.hits.length
    ? response.hits.hits.map(hit => hit._source.doc)
    : []
  
  return Promise.all(guests.map(prepareGuest))
}



export const updateGuest = async ({ id, guest }) => {
  await pouchdb.upsert(id, latest => ({ ...latest, ...guest }))
  return prepareGuest(await pouchdb.get(id))
}
