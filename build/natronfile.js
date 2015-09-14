/*
 * ubf build
 */
import {resolve} from "path";
import {task} from "natron";
import {src, dest} from "vinyl-fs";

const PKG_DIR = resolve(__dirname, "..");

function builder(babelOpts: object, out: string) {
  return function () {
    let babel = require("gulp-babel");
    return (src(resolve(PKG_DIR, "src", "**/*.js"))
      .pipe(babel(babelOpts))
      .pipe(dest(resolve(PKG_DIR, "dist", out)))
    );
  };
}

export var build = task.set([
  builder({modules: "common"}, "cjs"),
  builder({blacklist: ["es6"]}, "es6"),
]);
