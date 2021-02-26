module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    process.env === 'production' ? require('cssnano')({ preset: 'default' })() : false,
  ]
}
