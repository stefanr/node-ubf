/**
 * Universal Binary Format
 * @module ubf[test]
 */
import chai from "chai";
import chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);

Object.assign(global, {
  assert: chai.assert,
});
