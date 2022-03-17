# hamza-shatela-gulp4
Upwork task Hamza Shatela gulp4 template with node v17.6.0
Project aim to compress and optimize files from source folder called `src`
to `dist` folder with optimization of fonts, images, HTML and css

## How to start
#### Clone project
1. Clone repo git clone git@github.com:igavelyuk/hamza-shatela-gulp4.git
2. cd hamza-shatela-gulp4
3. npm install --global gulp-cli
4. npm install

#### Start optimization
 -  Open command line, enter `gulp` to start optimization from `src` folder to `dist`
 -  can use separate command for doing each step.
 -  Substitute to `gulp` you can use `gulp doAll`
 -  List of commands (to minify project you need keep order)
 - `gulp copyHTML` -> Copy HTML from `src` to `dist` folder
 - `gulp compileStyles` -> Compile SASS
 - `gulp copyCss` -> autoprefix and minify css put to `/dist/.../tmp/css`
 - `gulp cacheBust` -> cache bust
 - `gulp oneCss` -> make from all `min.css` files makes one `all-min.css`
 - `gulp minifyScripts` -> minify js
 - `gulp purifyCss` -> pass HTML export to filter classes from CSS
 - `gulp finalScript` -> make from all `min.js` files makes one `all-min.js`
 - `gulp copyAllExceptCss` -> in css folder can be extra resources, it copy to `dist` folder
 - `gulp copyFontsTTF` -> copy fonts with optimizations from `fonts` folder
 - `gulp copyFontsWeb` -> copy fonts with optimizations from `webfonts` folder
 - `gulp oneCssCompress` -> compress `all-min.css`
 - `gulp optimizeImages` -> optimize pictures
 - `gulp doImages` -> optimize pictures (same)
 - `gulp as` -> delete `tmp` folder (stored css)
 - `gulp purifyHtml` -> removes all CSS and JS imports

### Create project from ground (for study purpose)
```
mkdir hamza-shatela-gulp4
nvm install v17.6.0
nvm use v17.6.0
node -v > .nvmrc
npm install --global gulp-cli
npm init -y
```
#### In project
```
npm install gulp@4
touch .gitignore
```
### Install gulpfile depencies
```
npm install --save-dev gulp-sourcemaps gulp-concat gulp-rename gulp-replace gulp-terser gulp-sass sass gulp-postcss autoprefixer cssnano gulp-htmlmin gulp-cssmin vinyl-buffer gulp-purifycss gulp-fontmin gulp-autoprefixer gulp-delete-lines gulp-cheerio gulp-filter gulp-clean gulp-image-lqip fancy-log gulp imagemin-webp autoprefixer cssnano fancy-log gulp-autoprefixer gulp-cheerio gulp-clean gulp-cssmin gulp-delete-lines gulp-filter gulp-fontmin gulp-htmlmin gulp-image-lqip gulp-imagemin gulp-postcss gulp-purifycss gulp-rename gulp-replace gulp-sass gulp-terser htmlparser2 i imagemin-gifsicle imagemin-jpegtran imagemin-mozjpeg imagemin-optipng imagemin-pngquant imagemin-svgo install npm sass vinyl-buffer
```

### gulpfile.js
`touch gulpfile.js`
`nano gulpfile.js`
