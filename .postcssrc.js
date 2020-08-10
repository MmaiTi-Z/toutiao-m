module.exports = {
    plugins: {
      // vue cli中已经配置了autoprefixer 因此这里需要注释掉
      // autoprefixer: {
      //   browsers: ['Android >= 4.0', 'iOS >= 8'],
      // },
      'postcss-pxtorem': {
        // 根元素的值，lib-flexible的rem适配方案，把一行分为10分，每份就是十分之一
        // 所以rootValue应该设计成设计稿宽度的十分之一，设计稿宽是750，那么rootValue应为75
        // 但vant建议为37.5，因为vant是基于375写的
        // 唯一缺点是使用我们的设计稿的尺寸必须除以2
        // 更好的办法
        // 如果是vant的样式，就按照37.5转换
        // 如果是自己的样式，按照75转换
        // rootValue支持数字和函数的两种类型
        //  函数可以动态返回值,postcss处理每个css文件都会调用rootValue函数，他会把被处理的css文件相关信息通过参数传递给该函数
        // rootValue: 37.5,
        rootValue ({ file }) {
          return file.indexOf('vant') !== -1 ? 37.5 : 75
        },
        // 配置要转换的css属性， *表示所有属性都转换
        propList: ['*']
      }
    }
  }
