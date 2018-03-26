import path from 'path'
import { buildSchema } from "graphql"
import { fileLoader, mergeTypes } from 'merge-graphql-schemas'



const types = fileLoader(path.join(__dirname, '/**/*.graphql'))
export default buildSchema( mergeTypes(types, { recursive: true }) )
