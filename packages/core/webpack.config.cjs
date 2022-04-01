const path = require("path");
module.exports = Object.assign(require("../../webpack.config.js"), {
  devtool: "source-map",
  entry: path.join(process.cwd(), "source", "index.ts"),
  mode: "production",
  output: {
    filename: "core.bundle.js",
    library: {
      name: ["Marubase", "Core"],
      type: "assign-properties",
    },
    path: path.join(process.cwd(), "build"),
  },
});
