import { Client } from "elasticsearch"



export const host = "localhost:9200"
export default new Client({ host })
