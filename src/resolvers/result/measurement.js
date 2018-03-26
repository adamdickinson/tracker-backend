import pouchdb from "../../config/pouchdb"
import uuid from "uuid/v1"
import { prepareResult } from "./index"



export const measurementResult = async ({ id }) => {
  if( !id.startsWith("MeasurementResult:") ) return null
  return prepareResult(await pouchdb.get(id))
}



export const recordMeasurementResult = async ({ result }) => {
  const _id = `MeasurementResult:${uuid()}`
  await pouchdb.put({ _id, ...result })
  return prepareResult(await pouchdb.get(_id))
}
