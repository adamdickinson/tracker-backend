"use strict";

var _express = _interopRequireDefault(require("express"));

var _expressGraphql = _interopRequireDefault(require("express-graphql"));

var _resolvers = _interopRequireDefault(require("./resolvers"));

var _schema = _interopRequireDefault(require("./schema"));

var _cors = _interopRequireDefault(require("cors"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Configure web server
const app = (0, _express.default)();
app.use((0, _cors.default)());

_schema.default._typeMap.CurrentUserResult.resolveType = (data, context, info) => data._id.split(":", 2)[0];

app.use("/graphql", (0, _expressGraphql.default)({
  schema: _schema.default,
  rootValue: _resolvers.default,
  graphiql: true
}));
app.get("/", (req, res) => {
  res.send("Well done!");
}); // Start

app.listen(3000, () => console.log("Server is ready to go! Head to http://localhost:3000/graphql to get going."));