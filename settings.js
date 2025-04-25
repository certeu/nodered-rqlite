const path = require("path");

module.exports = {
  flowFile: "flows.json",
  storageModule: path.join(__dirname, "rqlite-storage.js"), // Ensure this path is correct
};
