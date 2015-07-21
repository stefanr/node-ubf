/*
 * Universal Binary Format
 * Test : sync
 */
import assert from "assert";
import {parseSync, ubfsizeSync, binarifySync} from "../src/index";

function hexBuf(buf: string): Buffer {
  return new Buffer(buf.replace(/[^0-9a-f]/gi, ""), "hex");
}

describe("Parser", () => {
  describe("parseSync()", () => {
    it("objects", () => {
      assert.deepEqual(
        (7),
        (parseSync(hexBuf("30 07")))
      );
      assert.deepEqual(
        ("abc"),
        (parseSync(hexBuf("20 03 61 62 63")))
      );
      assert.deepEqual(
        ([1,2,3]),
        (parseSync(hexBuf("14 06 30 01 30 02 30 03")))
      );
      assert.deepEqual(
        (1.25),
        (parseSync(hexBuf("39 3f f4 00 00 00 00 00 00")))
      );
      assert.deepEqual(
        ({a: 1, b: [1,2,3], c: {a: ["1","2","Hello World!"]}}),
        (parseSync(hexBuf("10 2e d0 01 61 30 01 d0 01 62 14 06 30 01 30 02 30 03 d0 01 63 10 19 d0 01 61 14 14 20 01 31 20 01 32 20 0c 48 65 6c 6c 6f 20 57 6f 72 6c 64 21")))
      );
    });
  });
});

describe("Binarifier", () => {
  describe("ubfsizeSync()", () => {
    it("objects", () => {
      assert.equal(2, ubfsizeSync(7));
      assert.equal(5, ubfsizeSync("abc"));
      assert.equal(8, ubfsizeSync([1,2,3]));
      assert.equal(9, ubfsizeSync(1.25));
      assert.equal(48, ubfsizeSync({a: 1, b: [1,2,3], c: {a: ["1","2","Hello World!"]}}));
    });
  });

  describe("binarifySync()", () => {
    it("objects", () => {
      assert.deepEqual(
        (hexBuf("30 07")),
        (binarifySync(7))
      );
      assert.deepEqual(
        (hexBuf("20 03 61 62 63")),
        (binarifySync("abc"))
      );
      assert.deepEqual(
        (hexBuf("14 06 30 01 30 02 30 03")),
        (binarifySync([1,2,3]))
      );
      assert.deepEqual(
        (hexBuf("39 3f f4 00 00 00 00 00 00")),
        (binarifySync(1.25))
      );
      assert.deepEqual(
        (hexBuf("10 2e d0 01 61 30 01 d0 01 62 14 06 30 01 30 02 30 03 d0 01 63 10 19 d0 01 61 14 14 20 01 31 20 01 32 20 0c 48 65 6c 6c 6f 20 57 6f 72 6c 64 21")),
        (binarifySync({a: 1, b: [1,2,3], c: {a: ["1","2","Hello World!"]}}))
      );
    });
  });
});
