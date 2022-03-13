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

touch gulpfile.js
