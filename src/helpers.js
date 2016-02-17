/**
 * Universal Binary Format
 * @module ubf
 */
import {Parser} from "./parser";
import {Binarifier} from "./binarifier";

export function parse(buf: Buffer, options? = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    let p = new Parser(null, options);
    p.context.on("value", ({value}) => resolve(value));
    p.context.on("error", (err) => reject(err));
    p.parse(buf);
  });
}

export function binarify(obj: any, options? = {}): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      let b = new Binarifier(null, options);
      resolve(b.binarify(obj));
    } catch (err) {
      reject(err);
    }
  });
}

export function ubfsize(obj: any, options? = {}): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      let b = new Binarifier(null, options);
      let {len} = b.byteLengthInfo(obj);
      resolve(len);
    } catch (err) {
      reject(err);
    }
  });
}
