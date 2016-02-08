/**
 * Universal Binary Format
 * @module ubf[test]
 */
import {parse, binarify, ubfsize} from "../src/__main__";

function hexBuf(buf: string): Buffer {
  return new Buffer(buf.replace(/[^0-9a-f]/gi, ""), "hex");
}

const samples = [
  { val: false,
    buf: "40",
    len: 1,
  },
  { val: null,
    buf: "42",
    len: 1,
  },
  { val: 7,
    buf: "30 07",
    len: 2,
  },
  { val: "abc",
    buf: "20 03 61 62 63",
    len: 5,
  },

  { val: [1, 2, 3],
    buf: "14 06 30 01 30 02 30 03",
    len: 8,
  },
  { val: 1.25,
    buf: "39 3f f4 00 00 00 00 00 00",
    len: 9,
  },
  { val: { a: 1,
           b: [1, 2, 3],
           c: { a: ["1", "2", "Hello World!"] },
         },
    buf: `10 2e e0 01 61 30 01 e0 01 62
          14 06 30 01 30 02 30 03 e0 01
          63 10 19 e0 01 61 14 14 20 01
          31 20 01 32 20 0c 48 65 6c 6c
          6f 20 57 6f 72 6c 64 21`,
    len: 48,
  },
];

describe("base", () => {
  it("parse", () => {
    let promises = [];
    for (let s of samples) {
      let p = parse(hexBuf(s.buf));
      promises.push(assert.eventually.deepEqual(p, s.val));
    }
    return Promise.all(promises);
  });

  it("binarify", () => {
    let promises = [];
    for (let s of samples) {
      let p = binarify(s.val);
      promises.push(assert.eventually.deepEqual(p, hexBuf(s.buf)));
    }
    return Promise.all(promises);
  });

  it("ubfsize", () => {
    let promises = [];
    for (let s of samples) {
      let p = ubfsize(s.val);
      promises.push(assert.eventually.equal(p, s.len));
    }
    return Promise.all(promises);
  });
});
