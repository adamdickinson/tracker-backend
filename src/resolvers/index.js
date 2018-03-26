export default {
  ...require("./group"),
  ...require("./hello"),
  ...require("./result").default,
  ...require("./test"),
  ...require("./user").default,
}
