const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const pug = require("gulp-pug");
const rename = require("gulp-rename");
const webpackStream = require("webpack-stream");
const webpackConfig = require("./webpack.config.js");
const connect = require("gulp-connect");
const browserSync = require("browser-sync").create();
const http = require("http-server");
const clean = require("gulp-clean");
const prettify = require("gulp-prettify");
const sitemap = require("gulp-sitemap");

// Define paths
const paths = {
  src: {
    styles: "src/styles/**/*.scss",
    scripts: ["src/js/**/*.js", "!src/js/**/node_modules/**"],
    pug: "src/pug/**/*.pug",
    fonts: "src/assets/fonts/**/*",
    favicons: "src/assets/favicons/**/*",
    additionalAssets: [
      "src/assets/**/*.png",
      "src/assets/**/*.jpg",
      "src/assets/**/*.jpeg",
      "src/assets/**/*.svg",
      "src/assets/**/*.webp",
      "src/assets/**/*.mp4",
    ],
    packageJson: "package.json",
  },
  dest: {
    css: "dist/styles",
    js: "dist/js",
    html: "dist",
    fonts: "dist/fonts",
    favicons: "dist",
    additionalAssets: "dist/assets",
  },
};

// Copy font files task
function copyFonts() {
  return gulp.src(paths.src.fonts).pipe(gulp.dest(paths.dest.fonts));
}

// Copy favicon files task
function copyFavicons() {
  return gulp.src(paths.src.favicons).pipe(gulp.dest(paths.dest.favicons));
}

// Copy additional asset folders task
function copyAssets() {
  return gulp
    .src(paths.src.additionalAssets)
    .pipe(gulp.dest(paths.dest.additionalAssets));
}

// Copy package.json to dist task
function copyPackageJson() {
  return gulp.src(paths.src.packageJson).pipe(gulp.dest(paths.dest.html));
}

// Compile Sass task
function sassTask() {
  return gulp
    .src(paths.src.styles)
    .pipe(
      sass({
        includePaths: ["node_modules"],
      }).on("error", sass.logError)
    )
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(
      rename({
        extname: ".min.css",
      })
    )
    .pipe(gulp.dest(paths.dest.css))
    .pipe(browserSync.stream());
}

// Bundle JS task
function jsTask() {
  return gulp
    .src(paths.src.scripts)
    .pipe(webpackStream(webpackConfig))
    .pipe(gulp.dest(paths.dest.js))
    .pipe(browserSync.stream());
}

// Compile 404 Pug task
function pug404Task() {
  return gulp
    .src("src/pug/404.pug")
    .pipe(pug())
    .pipe(rename("404.html")) // Rename the output file to 404.html
    .pipe(gulp.dest(paths.dest.html))
    .pipe(browserSync.stream());
}

// Minify pug task
function pugTask() {
  return gulp
    .src(paths.src.pug)
    .pipe(pug())
    .pipe(gulp.dest(paths.dest.html))
    .pipe(browserSync.stream());
}

// Serve task
function serveTask() {
  connect.server({
    root: "dist",
    livereload: true,
    middleware: function () {
      return [
        function (req, res, next) {
          if (req.url.endsWith(".css")) {
            res.setHeader("Content-Type", "text/css");
          }
          next();
        },
      ];
    },
  });

  browserSync.init({
    server: {
      baseDir: "dist",
    },
    open: true,
  });

  gulp.watch(paths.src.styles, gulp.series(sassTask));
  gulp.watch(paths.src.scripts, gulp.series(jsTask));
  gulp.watch(paths.src.pug, gulp.series(pugTask));
}

// HTTP server task
function httpServerTask() {
  return http
    .createServer({
      root: "./dist",
      port: 8080,
      cache: 1,
      robots: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
        // Add any additional headers here
      },
    })
    .listen(8080);
}

// Clean task
function cleanTask() {
  return gulp
    .src("dist", {
      read: false,
      allowEmpty: true,
    })
    .pipe(clean());
}

// Prettify HTML task
function prettifyHtmlTask() {
  return gulp
    .src(`dist/**/*.html`)
    .pipe(
      prettify({
        indent_size: 2,
      })
    )
    .pipe(gulp.dest(paths.dest.html));
}

// sitemap task
gulp.task("sitemap", () => {
  return gulp
    .src("dist/**/*.html", {
      read: false,
    })
    .pipe(
      sitemap({
        siteUrl: "https://farm-fresh.com",
      })
    )
    .pipe(gulp.dest("dist")); // Change this line to save the sitemap in the 'dist' folder
});

// Copy robots.txt task
function copyRobotsTxt() {
  return gulp.src("src/extra/robots.txt").pipe(gulp.dest("dist"));
}

// Build task
const build = gulp.series(
  cleanTask,
  gulp.parallel(
    copyFonts,
    copyFavicons,
    copyAssets,
    copyPackageJson,
    sassTask,
    jsTask,
    pugTask,
    pug404Task,
    "sitemap",
    copyRobotsTxt
  ),
  prettifyHtmlTask
);

// Default task
const defaultTask = gulp.series(
  build,
  gulp.parallel(serveTask, httpServerTask)
);

gulp.task("clean", cleanTask);
gulp.task("build", build);
gulp.task("default", defaultTask);