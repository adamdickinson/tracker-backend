"use strict";

var _cors = _interopRequireDefault(require("cors"));

var _express = _interopRequireDefault(require("express"));

var _expressGraphql = _interopRequireDefault(require("express-graphql"));

var _resolvers = _interopRequireDefault(require("./resolvers"));

var _schema = _interopRequireDefault(require("./schema"));

var _graphql = require("graphql");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Configure web server
const app = (0, _express.default)();
app.use((0, _cors.default)({
  credentials: true,
  origin: (origin, callback) => callback(null, true),
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"]
}));
const builtSchema = (0, _graphql.buildSchema)(_schema.default);

builtSchema._typeMap.CurrentUserResult.resolveType = (data, context, info) => data.id.split(":", 2)[0];

app.use("/graphql", (0, _expressGraphql.default)({
  schema: builtSchema,
  rootValue: _resolvers.default,
  graphiql: true
}));
app.get("/", (req, res) => {
  res.send("Well done!");
}); // Start

app.listen(3000, () => console.log("Server is ready to go! Head to http://localhost:3000/graphql to get going."));