import tests from "../../config/tests"
import { unpouchDoc } from "../../helpers/pouchdb"

import * as measurement from "./measurement"
import * as shooting from "./shooting"
import * as split from "./split"
import * as stageShuttle from "./stageShuttle"
import * as time from "./time"



export const prepareResult = async result => {
  result.test = unpouchDoc(tests.find(test => test.id == result.test))
  return unpouchDoc(result)
}



export default { ...measurement, ...shooting, ...split, ...stageShuttle, ...time }
