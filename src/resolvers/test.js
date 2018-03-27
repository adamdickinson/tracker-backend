import allTests from "../config/tests"
import { unpouchDoc, unpouchDocs } from "../helpers/pouchdb"



export const test = ({ id }) => unpouchDoc(allTests.find(test => test._id == id))
export const tests = () => unpouchDocs(allTests)
