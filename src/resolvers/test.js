import tests from "../config/tests"
export const test = ({ name }) => tests.find(test => test.name == name)
