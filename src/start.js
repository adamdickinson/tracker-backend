import cors from "cors"
import express from "express"
import graphqlHTTP from "express-graphql"
import resolvers from "./resolvers"
import schema from "./schema"
import { buildSchema } from "graphql"



// Configure web server
const app = express()
app.use(cors({ credentials: true, origin: (origin, callback) => callback(null, true), methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"] }))

const builtSchema = buildSchema(schema)
builtSchema._typeMap.CurrentUserResult.resolveType = (data, context, info) => data.id.split(":", 2)[0]

app.use("/graphql", graphqlHTTP({
  schema: builtSchema,
  rootValue: resolvers,
  graphiql: true
}))



app.get("/", (req, res) => { res.send("Well done!") })



// Start
app.listen(3000, () => console.log("Server is ready to go! Head to http://localhost:3000/graphql to get going."))
