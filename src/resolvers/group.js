import client from "../config/elasticsearch"
import flatMap from "lodash/flatMap"
import keyBy from "lodash/keyBy"
import pouchdb from "../config/pouchdb"
import uniq from "lodash/uniq"



export const addAthleteToGroup = async ({ athlete, group }) => {
  await pouchdb.upsert(group, latest => ({ ...latest, athletes: uniq([...latest.athletes, athlete]) }))
  group = await pouchdb.get(group)
  return prepareGroup(await pouchdb.get(_id))
}



export const createGroup = async ({ group }) => {
  const _id = `Group:${uuid()}`
  await pouchdb.put({ _id, ...group })
  return prepareGroup(await pouchdb.get(_id))
}



export const deleteGroup = async ({ id }) => {
  if( !id.startsWith("Group:") ) return null
  const group = await pouchdb.get(id)
  await pouchdb.remove(group)
  return prepareGroup(group)
}



export const group = async ({ id }) => {
  if( !id.startsWith("Group:") ) return null
  return prepareGroup(await pouchdb.get(id))
}


const prepareGroup = async group => {

  // Resolve athletes
  const athleteRows = await pouchdb.allDocs({ include_docs: true, keys: group.athletes })
  const athletes = athleteRows.rows.map(row => row.doc)
  group.athletes = unpouchDocs(athletes)

  // Tidy doc
  return unpouchDoc(group)

}



export const removeAthleteFromGroup = async ({ athlete, group }) => {
  await pouchdb.upsert(group, latest => ({ ...latest, athletes: latest.athletes.filter(id => id != athlete) }))
  return prepareGroup(await pouchdb.get(_id))
}



export const searchGroups = async ({ query }) => {
  const response = await client.search({
    body: {
      query: {
        bool: {
          filter: {
            match_phrase_prefix: { "doc._id": "Group:" }
          },
          must: {
            multi_match: {
              query:  `*${query}*`,
              type:   "phrase_prefix",
              fields: ["doc.name"]
            }
          }
        }
      }
    }
  })

  const groups = response.hits.hits.length
    ? response.hits.hits.map(hit => hit._source.doc)
    : []
  
  return Promise.all(groups.map(prepareGroup))
}



export const updateGroup = async ({ _id, group }) => {
  await pouchdb.upsert(_id, latest => ({ ...latest, ...group }))
  return prepareGroup(await pouchdb.get(_id))
}
