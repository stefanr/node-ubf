/*
 * Gulpfile
 */
require("babel/register");
process.env.BABEL_ENV = "gulp";

var gulp = require("gulp");

gulp.task("default", ["transpile"]);
gulp.task("transpile", ["build-cjs", "build-amd", "build-es6"]);

gulp.task("build-cjs", function () {
  var babel = require("gulp-babel");
  return (gulp.src(["src/**/*.js"])
    .pipe(babel({
      modules: "common",
    }))
    .pipe(gulp.dest("dist/cjs"))
  );
});

gulp.task("build-amd", function () {
  var babel = require("gulp-babel");
  return (gulp.src(["src/**/*.js"])
    .pipe(babel({
      modules: "amd",
    }))
    .pipe(gulp.dest("dist/amd"))
  );
});

gulp.task("build-es6", function () {
  var babel = require("gulp-babel");
  return (gulp.src(["src/**/*.js"])
    .pipe(babel({
      blacklist: [
        "es6",
      ],
    }))
    .pipe(gulp.dest("dist/es6"))
  );
});

gulp.task("watch", function () {
  gulp.watch(["src/**/*.js"], ["transpile"]);
});
