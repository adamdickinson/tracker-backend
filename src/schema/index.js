import path from 'path'
import { fileLoader, mergeTypes } from 'merge-graphql-schemas'



const types = fileLoader(path.join(__dirname, '/**/*.graphql'))
export default mergeTypes(types, { recursive: true })
