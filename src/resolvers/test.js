import tests from "../config/tests"
import { unpouchDoc } from "../helpers/pouchdb"



export const test = ({ id }) => unpouchDoc(tests.find(test => test._id == id))
