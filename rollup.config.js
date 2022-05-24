import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import CleanCSS from 'clean-css';
import { writeFileSync } from 'fs';
import pkg from './package.json'

const name = 'cxCalendar';
const about = `/**
 * cxCalendar
 * @version ${pkg.version}
 * @author ciaoca
 * @email ciaoca@gmail.com
 * @site https://github.com/ciaoca/cxCalendar
 * @license Released under the MIT license
 */`;

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/js/cxcalendar.js',
      format: 'umd',
      name: name,
      banner: about,
      indent: false,
    },
    {
      file: 'dist/js/cxcalendar.min.js',
      format: 'umd',
      name: name,
      banner: about,
      indent: false,
      plugins: [
        terser({
          compress: {}
        }),
      ],
    },
    {
      file: 'dist/js/cxcalendar.es.js',
      format: 'es',
      banner: about,
      indent: false,
    },
  ],
  plugins: [
    css({
      // output: 'css/cxcalendar.css'
      output(style) {
        writeFileSync('dist/css/cxcalendar.css', new CleanCSS({
          format: 'beautify'
        }).minify(style).styles);
        writeFileSync('dist/css/cxcalendar.min.css', new CleanCSS({
          format: 'keep-breaks'
        }).minify(style).styles);
      }
    })
  ]
};