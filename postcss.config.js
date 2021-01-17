module.exports = {
  plugins: [
    require("tailwindcss")("./tailwind.config.js"),
    require("autoprefixer"), // fungsinya jika menulis 1 property nanti yang lain akan di generate otomasis
  ],
};
