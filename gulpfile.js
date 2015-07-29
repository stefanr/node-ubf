/*
 * Universal Binary Format
 * Gulpfile
 */
process.env.BABEL_ENV = "gulp";
require("babel/register");

var gulp = require("gulp");

var babelOptions = {
  stage: 2,
  optional: [
    "es7.classProperties",
    "es7.functionBind",
  ],
};

gulp.task("default", ["transpile"]);

gulp.task("transpile", ["build-cjs", "build-amd", "build-es6"]);

gulp.task("build-cjs", function () {
  var babel = require("gulp-babel");
  var options = Object.assign({}, babelOptions, {
    modules: "common",
  });
  return (gulp.src(["src/**/*.js"])
    .pipe(babel(options))
    .pipe(gulp.dest("dist/cjs"))
  );
});

gulp.task("build-amd", function () {
  var babel = require("gulp-babel");
  var options = Object.assign({}, babelOptions, {
    modules: "amd",
  });
  return (gulp.src(["src/**/*.js"])
    .pipe(babel(options))
    .pipe(gulp.dest("dist/amd"))
  );
});

gulp.task("build-es6", function () {
  var babel = require("gulp-babel");
  var options = Object.assign({}, babelOptions, {
    blacklist: [
      "es6",
    ],
  });
  return (gulp.src(["src/**/*.js"])
    .pipe(babel(options))
    .pipe(gulp.dest("dist/es6"))
  );
});

gulp.task("watch", function () {
  gulp.watch(["src/**/*.js"], ["transpile"]);
});
