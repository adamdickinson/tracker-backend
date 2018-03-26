import pouchdb from "../../config/pouchdb"
import uuid from "uuid/v1"
import { prepareResult } from "./index"



export const timeResult = async ({ id }) => {
  if( !id.startsWith("TimeResult:") ) return null
  return prepareResult(await pouchdb.get(id))
}



export const recordTimeResult = async ({ result }) => {
  const _id = `TimeResult:${uuid()}`
  await pouchdb.put({ _id, ...result })
  return prepareResult(await pouchdb.get(_id))
}
