import express from "express"
import graphqlHTTP from "express-graphql"
import resolvers from "./resolvers"
import schema from "./schema"
import cors from "cors"



// Configure web server
const app = express()

app.use(cors())

schema._typeMap.CurrentUserResult.resolveType = (data, context, info) => data._id.split(":", 2)[0]

app.use("/graphql", graphqlHTTP({
  schema,
  rootValue: resolvers,
  graphiql: true
}))



app.get("/", (req, res) => { res.send("Well done!") })



// Start
app.listen(3000, () => console.log("Server is ready to go! Head to http://localhost:3000/graphql to get going."))
