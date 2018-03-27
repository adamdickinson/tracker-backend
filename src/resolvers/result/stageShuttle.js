import pouchdb from "../../config/pouchdb"
import uuid from "uuid/v1"
import { prepareResult } from "./index"



export const stageShuttleResult = async ({ id }) => {
  if( !id.startsWith("StageShuttleResult:") ) return null
  return prepareResult(await pouchdb.get(id))
}



export const recordStageShuttleResult = async ({ result }) => {
  const _id = `StageShuttleResult:${uuid()}`
  await pouchdb.put({ _id, ...result })
  return prepareResult(await pouchdb.get(_id))
}



export const recordStageShuttleResults = async ({ results }) => 
  results.map(result => recordStageShuttleResult({ result }))
