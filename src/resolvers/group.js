import client from "../config/elasticsearch"
import flatMap from "lodash/flatMap"
import keyBy from "lodash/keyBy"
import pouchdb from "../config/pouchdb"
import uniq from "lodash/uniq"



export const addAthleteToGroup = async ({ athlete, group }) => {
  await pouchdb.upsert(group, latest => ({ ...latest, athletes: uniq([...latest.athletes, athlete]) }))
  group = await pouchdb.get(group)

  const athleteRows = await pouchdb.allDocs({ include_docs: true, keys: group.athletes })
  const athletes = athleteRows.rows.map(row => row.doc)
  return { ...group, athletes }
}



export const removeAthleteFromGroup = async ({ athlete, group }) => {
  await pouchdb.upsert(group, latest => ({ ...latest, athletes: latest.athletes.filter(id => id != athlete) }))
  group = await pouchdb.get(group)

  const athleteRows = await pouchdb.allDocs({ include_docs: true, keys: group.athletes })
  const athletes = athleteRows.rows.map(row => row.doc)
  return { ...group, athletes }
}



export const createGroup = async ({ group }) => {
  const _id = `Group:${uuid()}`
  await pouchdb.put({ _id, ...group })
  return pouchdb.get(_id)
}



export const updateGroup = async ({ _id, group }) => {
  await pouchdb.upsert(_id, latest => ({ ...latest, ...group }))
  return pouchdb.get(_id)
}



export const findGroups = async ({ query }) => {
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

  let groups = response.hits.hits.length
    ? response.hits.hits.map(hit => hit._source.doc)
    : []


  const athleteIds   = uniq(flatMap(groups, group => group.athletes).filter(a => !!a))
  const athletes     = await pouchdb.allDocs({ include_docs: true, keys: athleteIds })
  const athletesById = keyBy(athletes.rows.map(athlete => athlete.doc), "_id")

  groups = groups.map(group => {
    if(!group.athletes) return group
    return { ...group, athletes: group.athletes.map(id => athletesById[id]) }
  })

  return groups
}
