/**
 * Universal Binary Format
 * @module ubf[test]
 */
import {parse} from "../src/__main__";

function hexBuf(buf: string): Buffer {
  return new Buffer(buf.replace(/[^0-9a-f]/gi, ""), "hex");
}

describe("chunks", () => {
  it("parse", () => {
    let buf = hexBuf("1c e0 01 61 2c 20 01 61 20 01 62 20 01 63 2f 1f");
    let p = parse(buf);
    return assert.eventually.deepEqual(p, { a: "abc" });
  });
});
