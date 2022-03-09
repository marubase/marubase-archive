const path = require("path");
module.exports = Object.assign(require("../../webpack.config.js"), {
  devtool: "source-map",
  entry: path.join(process.cwd(), "source", "index.ts"),
  mode: "production",
  output: {
    filename: "service-router.bundle.js",
    library: {
      name: ["Marubase", "ServiceRouter"],
      type: "assign-properties",
    },
    path: path.join(process.cwd(), "build"),
  },
});