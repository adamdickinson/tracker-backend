import pouchdb from "../config/pouchdb"
import uuid from "uuid/v1"
import tests from "../config/tests"



export const recordMeasurement = async ({ measurement }) => {
  const _id = `Measurement:${uuid()}`
  await pouchdb.put({ _id, ...measurement })
  measurement = await pouchdb.get(_id)
  measurement.athlete = await pouchdb.get(measurement.athlete)
  return measurement
}



export const recordResult = async ({ result }) => {
  const _id = `Result:${uuid()}`
  await pouchdb.put({ _id, ...result })
  result = await pouchdb.get(_id)
  result.athlete = await pouchdb.get(result.athlete)
  result.test = tests.find(test => test.name == result.test)
  return result
}



export const recordResults = async ({ results }) => results.map(result => recordResult({ result }))



export const recordShootingResult = async ({ result }) => {
  const _id = `ShootingResult:${uuid()}`
  await pouchdb.put({ _id, ...result })
  result = await pouchdb.get(_id)
  result.athlete = await pouchdb.get(result.athlete)
  result.test = tests.find(test => test.name == result.test)
  return result
}



export const recordShootingResults = async ({ results }) => results.map(result => recordShootingResult({ result }))
