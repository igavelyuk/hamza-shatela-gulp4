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
// const sass = require('gulp-sass');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const htmlmin = require('gulp-htmlmin');
const cssmin = require('gulp-cssmin');
const buffer = require('vinyl-buffer');
const purify = require('gulp-purifycss');
const fontmin = require('gulp-fontmin');
const gaprefixer = require('gulp-autoprefixer');
const deleteLines = require('gulp-delete-lines');

let /** @type {import("gulp-imagemin")} */ imagemin;

let /** @type {import("imagemin-gifsicle")} */ imageminGiftran;
let /** @type {import("imagemin-optipng")} */ imageminOpngtran;
let /** @type {import("imagemin-svgo")} */ imageminSvgotran;
let /** @type {import("imagemin-jpegtran")} */ imageminJpegtran;
let /** @type {import("imagemin-mozjpeg")} */ imageminMoztran;
let /** @type {import("imagemin-pngquant").default} */ imageminPngquant;
let /** @type {import("imagemin-webp").default} */ imageminWebptran;
let /** @type {import("insert-tag").default} */ insertTag;

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
  insertTag = (await import("insert-tag")).default;
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
    srcpurity: ['./dist/' + folder + '/*.html'],
    destpurity: './dist/' + folder + '/',
  },
  images: {
    src: ['./src/' + assets + '/img/**/*'],
    dest: './dist/' + assets + '/img/',
  },
  css: {
    src: ['./src/' + assets + '/css/**/*.css'],
    dest: './dist/' + assets + '/css/',
    srcone: ['./dist/' + assets + '/css/**/*.css'],
    destone: './dist/' + assets + '/css/',
  },
  fonts_ttf: {
    src: ['./src/' + assets + '/fonts/**/*.ttf'],
    dest: './dist/' + assets + '/fonts/',
  },
  styles: {
    src: ['./src/' + assets + '/scss/**/*.scss'],
    dest: './dist/' + assets + '/scss/',
  },
  scripts: {
    src: ['./src/' + assets + '/js/**/*.js'],
    dest: './dist/' + assets + '/js/',
    srcone: ['./dist/' + assets + '/js/**/*.js'],
    destone: './dist/' + assets + '/js/',
  },
  cachebust: {
    src: ['./src/' + folder + '/**/*.html'],
    dest: './dist/' + folder + '/',
  },
};

// Copy html files
const turboFunction = async () => {
  megaimport = (await series(compileStyles, copyCss, copyHtml, minifyScripts, oneCss, oneScript, purifyHtml, cacheBust)());
};
const turboFunction2 = async () => {
  megaimport = (await series(task('copyImages'), cacheBust)());
};
async function doAll() {
await Promise.all([turboFunction(), turboFunction2()]);
}

async function asyncAwaitTask() {
  const {
    version
  } = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log(version);
  await Promise.resolve('some result');
}

function copyFontsTTF() {
  return src(paths.fonts_ttf.src)
    .pipe(fontmin())
    .pipe(dest(paths.fonts_ttf.dest));
}

function copyHtml() {
  return src(paths.html.src)
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(dest(paths.html.dest));
}

//2 Must run second from CSS Optimization
function oneCss() {
  return src(paths.css.srcone)
    .pipe(sourcemaps.init())
    .pipe(gaprefixer())
    .pipe(concat('all-min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.css.destone));
}

//1 Must run first from CSS Optimization
function copyCss() {
  return src(paths.css.src)
    .pipe(postcss([autoprefixer(), cssnano()]))
    // .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.css.dest));
}

function purifyCss() {
  const HTML = paths.html.src;
  const JS = paths.scripts.src;
  return src(paths.css.src)
    // takes source CSS what have all stules for page it can be bundle of Bootstrap
    // than takes file what probably can use it and depend how often they used it cut parts of  source to dist
    // .pipe(purify([HTML, JS]))
    //previous line with javascript removed, gives an errors
    .pipe(purify(HTML))
    .pipe(dest(paths.css.dest));
};

// ------------------ deleteLines -------------------------------------
// I think pretty dangerous function
function purifyHtml() {
  return src(paths.html.srcpurity)
    .pipe(deleteLines({'filters': [/<script\s+type=["']text\/javascript["']\s+src=/i]}))
    .pipe(deleteLines({'filters': [/<script\s+src=/i]}))
    .pipe(deleteLines({'filters': [/<link\s+rel=["']/i]}))
    .pipe(deleteLines({'filters': [/<!--/i]}))
    .pipe(dest(paths.html.destpurity));
}
function insertTags() {
  return src(paths.html.srcpurity)
    .pipe(series(insertTag('<a>xxx<b>yyy</b>zzz<a>', '<mark>', [0, 2, 0, 5])))
    .pipe(dest(paths.html.destpurity));
}
function insertMegatags() {
  return (series('inTags'))
  // OR
  // (gulp.parallel("task1", "task2")());
}
task('inTags', series(startup, insertTags));

// gulp.task('remove-scripts', function () {
//   gulp.src('./build/index.html')
//
//   .pipe(gulp.dest('dist'));
// });
// gulp.task('remove-styles', function () {
//   gulp.src('./build/index.html')
//   .
//   .pipe(gulp.dest('dist'));
// });



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

function optimizeImages() {
  return src(paths.images.src)
    // in pipe converts all JPEGS to webp format
    // must be used with cautions
    .pipe(imagemin([
      // 	imageminWebptran({
      //     quality: 50
      //   }),
      imageminGiftran({
        colors: 128,
        interlaced: true,
        optimizationLevel: 3
      }),
      imageminMoztran({
        progressive: true,
        quality: 75
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
// Minify Images
/**
 * Lot of headache
 *
 */
function copy1Images() {
  return (series('copyImages')())
  // OR
  // (gulp.parallel("task1", "task2")());
}
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
function oneScript() {
  return src(paths.scripts.srcone)
    .pipe(sourcemaps.init())

    .pipe(concat('all-min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.scripts.destone));
}

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
exports.insertTags = insertTags;
exports.insertMegatags=insertMegatags
exports.doAll = doAll;
exports.copy1Images = copy1Images;
exports.oneCss = oneCss; // second pass script
exports.copyCss = copyCss;
exports.purifyCss = purifyCss;
exports.copyHtml = copyHtml;
exports.purifyHtml = purifyHtml; // second pass script
exports.copyFontsTTF = copyFontsTTF;
exports.optimizeImages = optimizeImages;
exports.compileStyles = compileStyles;
exports.oneScript = oneScript; // second pass script
exports.minifyScripts = minifyScripts;
exports.cacheBust = cacheBust;
exports.watcher = watcher;
exports.default = series(
  watcher, doAll
);
//
