import PouchDB from "pouchdb"
PouchDB.plugin(require("pouchdb-upsert"))
PouchDB.plugin(require("pouchdb-find"))
export default new PouchDB("http://localhost:7984/central") 
