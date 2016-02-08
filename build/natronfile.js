/**
 * Universal Binary Format
 * @module ubf[build]
 */
import {resolve} from "path";
import {src, dest} from "natron-vinyl";
import {transform} from "vinyl-tf-babel";

const PKG_DIR = resolve(__dirname, "..");

function builder(target: string, options?: Object): Function {
  return () => {
    return (src(resolve(PKG_DIR, "src", "**/*.js"))
      .pipe(transform(options))
      .pipe(dest(resolve(PKG_DIR, "dist", target)))
    );
  };
}

export const build = builder("cjs", {
  "babelrc": false,
  "plugins": [
    "transform-flow-strip-types",
    "transform-object-assign",
  ],
  "presets": [
    "es2015",
    "stage-0",
  ],
});
