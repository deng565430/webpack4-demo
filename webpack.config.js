const path = require("path");
// 插件都是一个类，所以我们命名的时候尽量用大写开头
const HtmlWebpackPlugin = require("html-webpack-plugin");

const ExtractTextWebpackPlugin = require("extract-text-webpack-plugin");

const CleanWebpackPlugin = require("clean-webpack-plugin");

const webpack = require("webpack");

module.exports = {
  entry: "./src/index.js", // 入口文件
  output: {
    filename: "bundle.js", // 打包后的文件名称
    path: path.resolve("dist") // 打包后的目录，必须是绝对路径
  },
  resolve: {
    // 别名
    alias: {
      $: "./src/jquery.js"
    },
    // 省略后缀
    extensions: [".js", ".json", ".css"]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
        include: /src/, // 只转化src目录下的js
        exclude: /node_modules/ // 排除掉node_modules，优化打包速度
      },
      {
        test: /\.css$/, // 解析css
        use: ["style-loader", "css-loader", "postcss-loader"]
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192, // 小于8k的图片自动转成base64格式，并且不会存在实体图片
              outputPath: "images/" // 图片打包后存放的目录
            }
          }
        ]
      },
      {
        test: /\.(htm|html)$/,
        use: "html-withimg-loader"
      },
      {
        test: /\.(eot|ttf|woff|svg)$/,
        use: "file-loader"
      }
    ]
  }, // 处理对应模块
  // 提取公共代码
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          // 抽离第三方插件
          test: /node_modules/, // 指定是node_modules下的第三方包
          chunks: "initial",
          name: "vendor", // 打包后的文件名，任意命名
          // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
          priority: 10
        },
        utils: {
          // 抽离自己写的公共代码，utils这个名字可以随意起
          chunks: "initial",
          name: "utils", // 任意命名
          minSize: 0 // 只要超出0字节就生成一个新包
        }
      }
    }
  },
  plugins: [
    // 打包前先清空
    new CleanWebpackPlugin("dist"),
    // 热替换，热替换不是刷新
    new webpack.HotModuleReplacementPlugin(),
    // 通过new一下这个类来使用插件
    new HtmlWebpackPlugin({
      // 用哪个html作为模板
      // 在src目录下创建一个index.html页面当做模板来用
      template: "./src/index.html",
      hash: true // 会在打包好的bundle.js后面加上hash串
    }),
    // 提取公共代码配置
    new HtmlWebpackPlugin({
      filename: "a.html",
      template: "./src/index.html", // 以index.html为模板
      chunks: ["vendor", "a"]
    }),
    new HtmlWebpackPlugin({
      filename: "b.html",
      template: "./src/index.html", // 以index.html为模板
      chunks: ["vendor", "b"]
    }),
    require("autoprefixer"),
    // 拆分后会把css文件放到dist目录下的css/style.css
    new ExtractTextWebpackPlugin("css/style.css")
  ], // 对应的插件
  devServer: {
    contentBase: "./dist",
    host: "localhost", // 默认是localhost
    port: 3000, // 端口
    open: true, // 自动打开浏览器
    hot: true // 开启热更新
  }, // 开发服务器配置
  mode: "development" // 模式配置
};
