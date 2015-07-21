/*
 * Universal Binary Format
 */
if (!!process.env.UBF_DEV_ENV) {
  module.exports = require("./src/index");
} else {
  module.exports = require("./dist/common/index");
}
