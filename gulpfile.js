/*
 * Universal Binary Format
 * Gulpfile
 */
var gulp = require("gulp");
var assign = Object.assign || require("object.assign");

var babelOptions = {
  stage: 2,
  optional: [
    "es7.classProperties",
    "es7.decorators",
    "es7.functionBind",
  ],
};

gulp.task("default", ["transpile"]);

gulp.task("transpile", ["build-common", "build-amd", "build-system"]);

gulp.task("build-common", function () {
  var babel = require("gulp-babel");
  var options = assign({}, babelOptions, {
    modules: "common",
  });
  return (gulp.src(["src/**/*.js"])
    .pipe(babel(options))
    .pipe(gulp.dest("dist/common"))
  );
});

gulp.task("build-amd", function () {
  var babel = require("gulp-babel");
  var options = assign({}, babelOptions, {
    modules: "amd",
  });
  return (gulp.src(["src/**/*.js"])
    .pipe(babel(options))
    .pipe(gulp.dest("dist/amd"))
  );
});

gulp.task("build-system", function () {
  var babel = require("gulp-babel");
  var options = assign({}, babelOptions, {
    modules: "system",
  });
  return (gulp.src(["src/**/*.js"])
    .pipe(babel(options))
    .pipe(gulp.dest("dist/system"))
  );
});

gulp.task("watch", function () {
  gulp.watch(["src/**/*.js"], ["transpile"]);
});
