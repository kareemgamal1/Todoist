const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.join(__dirname, "dist"),
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2?)$/,
        use: {
          loader: 'file-loader'
          , options: {
            name: '../css/fonts/[name]-[hash:8].[ext]'
          }
        }
      }, {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: "defaults" }]
            ], compact: false
          }
        }
      }
    ],
  }, watch: true,
};
