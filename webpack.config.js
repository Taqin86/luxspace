const path = require("path"); // bawaan dari node js
const fs = require("fs"); // fs = filesystem

const CopyWebpackPlugin = require("copy-webpack-plugin"); // copy
const HTMLWebpackPlugin = require("html-webpack-plugin"); // membaca html
const ImageMinPlugin = require("imagemin-webpack-plugin").default; // untuk meminify image
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // meng ekstrak css yang ada
const { CleanWebpackPlugin } = require("clean-webpack-plugin");// untuk menghapus build yang reload

const environment = require("./configs/env");

const templateFiles = fs.readdirSync(
  path.resolve(__dirname, environment.paths.source, "templates")
); // read filesystem tujuan ke folder templates 
const htmlPluginEntries = templateFiles.map(
  (template) =>
    new HTMLWebpackPlugin({
      inject: true,
      hash: false,
      filename: template,
      template: path.resolve(environment.paths.source, "templates", template),
      favicon: path.resolve(environment.paths.source, "images", "favicon.ico"),
    })
); // config untuk input dari file html, dia mau template datang dari folder templates. dan di bawahnya ada favicon

module.exports = {
  entry: {
    app: path.resolve(environment.paths.source, "js", "app.js"), //semua berawal dari sini
  },
  output: {
    path: environment.paths.output,
    filename: "js/[name].js",
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"], // jika di tempakan di awal maka akan di baca terakhir
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: environment.paths.source,
        use: ["babel-loader"], // menggunakan library babel-loader ini agar tidak mencantumkan require di app.js
      },
      {
        test: /\.(png|gif|jpg|jpeg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              name: "images/design/[name].[hash:6].[ext]",
              publicPath: "../",
              limit: environment.limits.images,
            },
          },
        ],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              name: "fonts/[name].[hash:6].[ext]",
              publicPath: "../",
              limit: environment.limits.fonts,
            },
          },
        ],
      },
    ],
  },

  plugins: [ // tempatnya inisiasi
    new MiniCssExtractPlugin({
      filename: "css/[name].minify.css",
    }),
    new ImageMinPlugin({ test: /\.(jpg|jpeg|png|gif|svg)$/i }),
    new CleanWebpackPlugin({
      verbose: true, // membersihkan hasil build
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(environment.paths.source, "images", "content"),
          to: path.resolve(environment.paths.output, "images", "content"),
          toType: "dir",
          globOptions: {
            ignore: ["*.DS_Store", "Thumbs.db"],
          },
        },
        {
          from: path.resolve(environment.paths.source, "images", "design"),
          to: path.resolve(environment.paths.output, "images", "design"),
          toType: "dir",
          globOptions: {
            ignore: ["*.DS_Store", "Thumbs.db"],
          },
        },
        {
          from: path.resolve(environment.paths.source, "css"),
          to: path.resolve(environment.paths.output, "css"),
          toType: "dir",
          globOptions: {
            ignore: ["*.DS_Store", "Thumbs.db"],
          },
        },
      ],
    }),
  ].concat(htmlPluginEntries),
  target: "web", // biar tau bakan di deploy kemana
};
