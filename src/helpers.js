/**
 * Universal Binary Format
 * @module ubf
 */
import {Parser} from "./parser";
import {Binarifier} from "./binarifier";

export function parse(buf: Buffer): Promise<any> {
  return new Promise((resolve, reject) => {
    let p = new Parser();
    p.context.on("value", (e) => resolve(e.value));
    p.context.on("error", (e) => reject(e));
    p.parse(buf);
  });
}

export function binarify(obj: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      let b = new Binarifier();
      resolve(b.binarify(obj));
    } catch (err) {
      reject(err);
    }
  });
}

export function ubfsize(obj: any): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      let b = new Binarifier();
      let i = b.byteLengthInfo(obj);
      resolve(i.len);
    } catch (err) {
      reject(err);
    }
  });
}
