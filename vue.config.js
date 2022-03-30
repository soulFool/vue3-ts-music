module.exports = {
  css: {
    loaderOptions: {
      sass: {
        // 全局引入变量和 mixin(需要注意版本, 这个要新版本才行)
        additionalData: `
          @import "@/assets/scss/variable.scss";
          @import "@/assets/scss/mixin.scss";
        `
      }
    }
  }
}
