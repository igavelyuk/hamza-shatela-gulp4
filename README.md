# hamza-shatela-gulp4
Upwork task Hamza Shatela gulp4 template with node v17.6.0

## Create project
```
mkdir hamza-shatela-gulp4
nvm install v17.6.0
nvm use v17.6.0
node -v > .nvmrc
npm install --global gulp-cli
npm init -y
```
## In project
```
npm install gulp@4
touch .gitignore
```
### Install gulpfile depencies
```
npm install --save-dev gulp-sourcemaps gulp-concat gulp-rename gulp-replace gulp-terser gulp-sass gulp-postcss autoprefixer cssnano gulp-htmlmin
```

```
npm install --save-dev gulp-imagemin imagemin-jpegtran imagemin-pngquant
```
```
npm install --save-dev gulp-cssmin gulp-rename
```

### gulpfile.js

`touch gulpfile.js`
`nano gulpfile.js`

```javascript

// Fetch required plugins
const gulp = require('gulp');
const { src, dest, watch, series, parallel } = require('gulp');
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

let /** @type {import("gulp-imagemin")} */ imagemin;
let /** @type {import("imagemin-jpegtran")} */ imageminJpegtran;
let /** @type {import("imagemin-pngquant").default} */ imageminPngquant;

const startup = async () => {
    // @ts-ignore
    imagemin = (await import("gulp-imagemin")).default;
    // @ts-ignore
    imageminJpegtran = (await import("imagemin-jpegtran")).default;
    imageminPngquant = (await import("imagemin-pngquant")).default;
};

// run this task before any that require imagemin
gulp.task("startup", async () => {
    await startup();
});


// All paths
const paths = {
  html: {
    src: ['./src/**/*.html'],
    dest: './dist/',
  },
  images: {
    src: ['./src/images/**/*'],
    dest: './dist/images/',
  },
  styles: {
    src: ['./src/scss/**/*.scss'],
    dest: './dist/css/',
  },
  scripts: {
    src: ['./src/js/**/*.js'],
    dest: './dist/js/',
  },
  cachebust: {
    src: ['./dist/**/*.html'],
    dest: './dist/',
  },
};

// Copy html files
function copyHtml() {
  return src(paths.html.src)
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(dest(paths.html.dest));
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
function optimizeImages() {
  return src(paths.images.src)
    .pipe(imagemin().on('error', (error) => console.log(error)))
    .pipe(dest(paths.images.dest));
}
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
    .pipe(rename({ suffix: '.min' }))
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
    .pipe(rename({ suffix: '.min' }))
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
```
