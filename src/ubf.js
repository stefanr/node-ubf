/*
 * Universal Binary Format
 */
import {Context} from "./context";
import {Parser} from "./parser";
import {Binarifier} from "./binarifier";

/**
 * parse
 */
export function parse(buffer: Buffer): Promise<any> {
  return new Promise((resolve, reject) => {
    let p = new Parser(new Context());
    p.on("value", (e) => {
      resolve(e.detail.value);
    });
    p.on("error", (e) => {
      reject(e.detail);
    });
    p.parse(buffer);
  });
}

/**
 * parseSync
 */
export function parseSync(buffer: Buffer): any {
  let p = new Parser(new Context());
  let value;
  p.on("value", (e) => {
    value = e.detail.value;
    p.stop();
  });
  p.on("error", (e) => {
    if (Error.captureStackTrace) {
      Error.captureStackTrace(e.detail, parseSync);
    }
    throw e.detail;
  });
  p.parse(buffer);
  return value;
}

/**
 * binarify
 */
export function binarify(obj: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      let b = new Binarifier(new Context());
      resolve(b.binarify(obj));
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * binarifySync
 */
export function binarifySync(obj: any): Buffer {
  try {
    let b = new Binarifier(new Context());
    return b.binarify(obj);
  } catch (err) {
    if (Error.captureStackTrace) {
      Error.captureStackTrace(err, binarifySync);
    }
    throw err;
  }
}

/**
 * ubfsize
 */
export function ubfsize(obj: any): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      let b = new Binarifier(new Context());
      let info = b.byteLengthInfo(obj);
      resolve(info.len);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * ubfsizeSync
 */
export function ubfsizeSync(obj: any): number {
  try {
    let b = new Binarifier(new Context());
    let info = b.byteLengthInfo(obj);
    return info.len;
  } catch (err) {
    if (Error.captureStackTrace) {
      Error.captureStackTrace(err, ubfsizeSync);
    }
    throw err;
  }
}
