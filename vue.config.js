const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  publicPath: '/nepg/', // 指定项目的基本路径
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4523',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
    historyApiFallback: {
      index: '/nepg/' 
    }
  }
});
