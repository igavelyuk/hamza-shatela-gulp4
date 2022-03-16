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
npm install --save-dev imagemin-gifsicle imagemin-jpegtran imagemin-optipng imagemin-svgo imagemin-webp
npm install --save-dev gulp-sass sass
npm install --save-dev gulp-fontmin
npm install --save-dev gulp-autoprefixer
npm install --save-dev gulp-clean
```

### gulpfile.js

`touch gulpfile.js`
`nano gulpfile.js`

### Clean unnecessary CSS with PurifyCSS (Delete unused css)
https://github.com/purifycss/gulp-purifycss

`npm install --save-dev gulp-purifycss`

```
var purify = require('gulp-purifycss');

gulp.task('css', function() {
  return gulp.src('./public/app/example.css')
    .pipe(purify(['./public/app/**/*.js', './public/**/*.html']))
    .pipe(gulp.dest('./dist/'));
});
```
