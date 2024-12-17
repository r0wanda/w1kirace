import { series, parallel, src, dest } from 'gulp';
import autoprefixer from 'autoprefixer';
import postcss from 'gulp-postcss';
import ts from 'gulp-typescript';
import csso from 'gulp-csso';
import { rimrafSync } from 'rimraf';
import { existsSync } from 'node:fs';
import babel from 'gulp-babel';
import terser from 'gulp-terser';
import browserify from 'browserify';
import through2 from 'through2';
import { Readable } from 'node:stream';

function preclean(cb: Function) {
    if (existsSync('./js')) rimrafSync('./js');
    cb();
}
function types() {
    const proj = ts.createProject('./src/tsconfig.json');
    return proj.src().pipe(proj());
}
function compilejs() {
    return src('./src/*.ts').pipe(babel({
        plugins: [
            [
                'babel-plugin-transform-remove-imports', {
                    test: '\\.(js)$'
                }
            ] as unknown as string,
        ],
        presets: [
            '@babel/preset-typescript',
            // please fix gulp-babel types
            [
                '@babel/preset-env',
                {
                    useBuiltIns: 'entry',
                    corejs: '3.39',
                }
            ] as unknown as string
        ],
        // @ts-ignore
        targets: 'defaults',
        // @ts-ignore
        sourceType: 'module'
    })).pipe(through2.obj(function (file, _, cb) {
        // babel generates require statements and exports statements, so define those
        // if something is exported, it gets added to the window scope
        if (file.isBuffer()) {
            let code = file.contents.toString().replace('"use strict"', '');
            code = 'if(!window["exports"])window.exports=window;if(!window["require"])window.require=()=>{};' + code;
            file.contents = Buffer.from(code);
        }
        cb(null, file);
    })).pipe(dest('./js'));
}
function bundle() {
    return src('./js/*').pipe(through2.obj(function (file, _, cb) {
        if (file.isStream()) {
            const b = browserify({
                basedir: './js'
            });
            b.add(file.contents);
            file.contents = b.bundle();
        } else if (file.isBuffer()) {
            const b = browserify({
                basedir: './js'
            });
            b.add(Readable.from(file.contents));
            file.contents = b.bundle();
        }
        cb(null, file);
    })).pipe(dest('./js'));
}
function minjs() {
    return src('./js/*')
    /*.pipe(terser({
        ecma: 6,
        module: true,
        keep_classnames: true,
        mangle: false
    }))*/.pipe(dest('./public'));
}
function cleanjs(cb: Function) {
    rimrafSync('./js');
    cb();
}
/*function babelmin(cb: Function) {
    src('./js/*.js')
    .pipe().pipe(dest('./public'));
    cb();
}*/

function css(cb: Function) {
    src('./src/*.css')
    .pipe(postcss([ autoprefixer() ]))
    .pipe(csso())
    .pipe(dest('./public'));
    cb();
}

export default parallel(
    series(preclean, parallel(types, compilejs), /*bundle,*/ minjs, cleanjs),
    css
);