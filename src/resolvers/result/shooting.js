import pouchdb from "../../config/pouchdb"
import uuid from "uuid/v1"
import { prepareResult } from "./index"



export const shootingResult = async ({ id }) => {
  if( !id.startsWith("ShootingResult:") ) return null
  return prepareResult(await pouchdb.get(id))
}



export const recordShootingResult = async ({ result }) => {
  const _id = `ShootingResult:${uuid()}`
  await pouchdb.put({ _id, ...result })
  return prepareResult(await pouchdb.get(_id))
}
