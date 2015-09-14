# [![ubf][ubf-img]][ubf-url]
**Universal Binary Format**

[![npm][npm-img]][npm-url] [![build status][travis-img]][travis-url]

## Documentation
_TODO_

## Examples
### Parser

```js
import {Context, Parser, parseSync, parse} from "ubf";

function hexBuf(buf: string): Buffer {
  return new Buffer(buf.replace(/[^0-9a-f]/gi, ""), "hex");
}

let parser = new Parser(new Context());
parser.on("value", (e) => {
  console.log(e.detail.value);
});
parser.on("error", (e) => {
  console.error(e.detail);
});

parser.parse(hexBuf("20 03 61 62 63, 14 06 30 01 30 02 30 03, 30 07, 42"));
// abc
// [ 1, 2, 3 ]
// 7
// true

parser.parse(hexBuf("97 02 23 54"));
// [ParseError: Unknown marker]

console.log(parseSync(hexBuf("10 0f d0 01 61 30 01 d0 01 62 30 02 d0 01 63 30 03")));
// { a: 1, b: 2, c: 3 }

parse(hexBuf("20 0c 48 65 6c 6c 6f 20 57 6f 72 6c 64 21")).then((val) => {
  console.log(val);
  // Hello World!
});
```

```sh
> babel-node examples/parser
abc
[ 1, 2, 3 ]
7
true
{ [ParseError: Unknown marker]
  name: 'ParseError',
  message: 'Unknown marker',
  detail: { code: 1, buffer: <Buffer 97 02 23 54>, offset: 0, marker: 151 } }
{ a: 1, b: 2, c: 3 }
Hello World!
```

[ubf-img]: https://raw.githubusercontent.com/stefanr/node-ubf/gh-pages/images/ubf.png
[ubf-url]: https://npmjs.com/package/ubf
[npm-img]: https://img.shields.io/npm/v/ubf.svg
[npm-url]: https://npmjs.org/package/ubf
[travis-img]: https://travis-ci.org/stefanr/node-ubf.svg
[travis-url]: https://travis-ci.org/stefanr/node-ubf
