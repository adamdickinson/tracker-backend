import pouchdb from "../../config/pouchdb"
import uuid from "uuid/v1"
import { prepareResult } from "./index"



export const splitResult = async ({ id }) => {
  if( !id.startsWith("SplitResult:") ) return null
  return prepareResult(await pouchdb.get(id))
}



export const recordSplitResult = async ({ result }) => {
  const _id = `SplitResult:${uuid()}`
  await pouchdb.put({ _id, ...result })
  return prepareResult(await pouchdb.get(_id))
}
