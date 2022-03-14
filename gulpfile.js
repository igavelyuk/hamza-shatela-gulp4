// Fetch required plugins
// const gulp = require('gulp');
const {
  task,
  src,
  dest,
  watch,
  series,
  parallel
} = require('gulp');
// const imagemin = require('gulp-imagemin');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const terser = require('gulp-terser');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const htmlmin = require('gulp-htmlmin');
const cssmin = require('gulp-cssmin');
const buffer = require('vinyl-buffer');

let /** @type {import("gulp-imagemin")} */ imagemin;

let /** @type {import("imagemin-gifsicle")} */ imageminGiftran;
let /** @type {import("imagemin-optipng")} */ imageminOpngtran;
let /** @type {import("imagemin-svgo")} */ imageminSvgotran;
let /** @type {import(""imagemin-jpegtran"")} */ imageminJpegtran;
let /** @type {import("imagemin-mozjpeg")} */ imageminMoztran;
let /** @type {import("imagemin-pngquant").default} */ imageminPngquant;
let /** @type {import("imagemin-webp").default} */ imageminWebptran;

const startup = async () => {
  // @ts-ignore
  imagemin = (await import("gulp-imagemin")).default;
  // @ts-ignore
  imageminGiftran = (await import("imagemin-gifsicle")).default;
  imageminOpngtran = (await import("imagemin-optipng")).default;
  imageminSvgotran = (await import("imagemin-svgo")).default;
  imageminJpegtran = (await import("imagemin-jpegtran")).default;
  imageminMoztran = (await import("imagemin-mozjpeg")).default;
  imageminPngquant = (await import("imagemin-pngquant")).default;
  imageminWebptran = (await import("imagemin-webp")).default;
};

// run this task before any that require imagemin
task("startup", async () => {
  await startup();
});
const folder = "preview-file"
const assets = folder + "/assets"
// All paths
const paths = {
  html: {
    src: ['./src/' + folder + '/*.html'],
    dest: './dist/' + folder + '/',
  },
  images: {
    src: ['./src/' + assets + '/img/**/*'],
    dest: './dist/' + assets + '/',
  },
  css: {
    src: ['./src/' + assets + '/css/**/*.css'],
    dest: './dist/' + assets + '/css/',
  },
  styles: {
    src: ['./src/' + assets + '/scss/**/*.scss'],
    dest: './dist/' + assets + '/scss/',
  },
  scripts: {
    src: ['./src/' + assets + '/js/**/*.js'],
    dest: './dist/' + assets + '/js/',
  },
  cachebust: {
    src: ['./src/' + folder + '/**/*.html'],
    dest: './dist/' + folder + '/',
  },
};

// Copy html files
// function doAll() {
//   copyCss();
//   copyHtml();
//   optimizeImages();
//   compileStyles();
//   minifyScripts();
//   cacheBust();
// }

function copyHtml() {
  return src(paths.html.src)
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(dest(paths.html.dest));
}

// function copyCss() {
//   return src(paths.css.src)
//   .pipe(cssmin())
//   .pipe(rename({suffix: '.min'}))
//   .pipe(dest(paths.css.dest));
// }
function copyCss() {
  return src(paths.css.src)
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.css.dest));
}
// Optimize images(.png, .jpeg, .gif, .svg)
/**
 * Custom options
 * imagemin([
 *       imagemin.gifsicle({ interlaced: true }),
 *       imagemin.mozjpeg({ quality: 75, progressive: true }),
 *       imagemin.optipng({ optimizationLevel: 5 }),
 *       imagemin.svgo({
 *         plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
 *       })
 *     ])
 */
// function optimizeImages() {
//   return src(paths.images.src)
//     // .pipe(changed(imgDest))
//     .pipe(imagemin([
//       // imagemin.gifsicle({
//       //   interlaced: true
//       // }),
//       // imagemin.mozjpeg({
//       //   progressive: true
//       // }),
//       // imagemin.optipng({
//       //   optimizationLevel: 5
//       // })
//     ]))
//     .pipe(dest(paths.images.src));
// }
function optimizeImages() {
  return src(paths.images.src)
    .pipe(imagemin([
			imageminWebptran({
        quality: 50
      }),
      imageminGiftran({
        colors: 128,
        interlaced: true,
        optimizationLevel: 3
      }),
      imageminMoztran({
        progressive: true
      }),
      imageminOpngtran({
        optimizationLevel: 7
        // Level and trials:
        // (1)     (2)      (3)       (4)       (5)        (6)        (7)
        // 1 trial 8 trials 16 trials 24 trials 48 trials 120 trials 240 trials

      })
    ]).on('error', (error) => console.log(error)))
    .pipe(dest(paths.images.dest));
}
//
// function copyImages() {
//   // return src(paths.images.src)
//   //   .pipe(function() {
//   //     return series(startup, optimizeImages)
//   //   })
//   //   .pipe(dest(paths.images.dest));
// }
// task('copyimages', function(done) {
//   series(startup, optimizeImages);
//   done();
// });
task('copyImages', series(startup, optimizeImages));

// Compile styles
/**
 * To concat styles, add below code after sourcemaps is initialized
 * .pipe(concat('{OutputFileName}.css'))
 *
 * Note - Not all plugins work with postcss, only the ones mentioned in their documentation
 */
function compileStyles() {
  return src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.styles.dest));
}
// Minify scripts
/**
 * To concat scripts, add below code after sourcemaps is initialized
 * .pipe(concat('{OutputFileName}.js'))
 */
function minifyScripts() {
  return src(paths.scripts.src)
    .pipe(sourcemaps.init())
    .pipe(terser().on('error', (error) => console.log(error)))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.scripts.dest));
}
// Cache bust
/**
 * For cache bust, include 'chache_bust' parameter with any number to all styles and scripts links
 * For e.g. -
 * <link rel="stylesheet" href="/dist/css/style.min.css?cache_bust=123" />
 * <script src="/dist/js/script.min.js?cache_bust=123"></script>
 */
function cacheBust() {
  return src(paths.cachebust.src)
    .pipe(replace(/cache_bust=\d+/g, 'cache_bust=' + new Date().getTime()))
    .pipe(dest(paths.cachebust.dest));
}

// Watch for file modification at specific paths and run respective tasks accordingly
function watcher() {
  watch(paths.html.src, series(copyHtml, cacheBust));
  watch(paths.images.src, series(startup, optimizeImages));
  watch(paths.styles.src, series(compileStyles, cacheBust));
  watch(paths.scripts.src, parallel(minifyScripts, cacheBust));
}
// Export tasks to make them public
// exports.copyImages = copyImages;
exports.copyHtml = copyHtml;
exports.optimizeImages = optimizeImages;
exports.compileStyles = compileStyles;
exports.minifyScripts = minifyScripts;
exports.cacheBust = cacheBust;
exports.watcher = watcher;
exports.default = series(
  parallel(copyHtml, optimizeImages, compileStyles, minifyScripts),
  cacheBust,
  watcher
);
//
