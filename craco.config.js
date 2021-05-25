const CracoLessPlugin = require("craco-less");
const path = require("path");

const pathResolve = pathUrl => path.join(__dirname, pathUrl);

module.exports = {
  webpack: {
    //项目的路径别名
    alias: {
      "@@": pathResolve("."),
      "@": pathResolve("src"),
      "@assets": pathResolve("src/assets"),
      "@common": pathResolve("src/common"),
      "@components": pathResolve("src/components"),
      "@hooks": pathResolve("src/hooks"),
      "@pages": pathResolve("src/pages"),
      "@store": pathResolve("src/store"),
      "@utils": pathResolve("src/utils"),
      "@api": pathResolve("src/api"),
    },
  },
  //antd的按需引入
  babel: {
    plugins: [
      ["import", { libraryName: "antd", style: true }],
      ["@babel/plugin-proposal-decorators", { legacy: true }],
    ],
  },
  //antd的自定义主题色
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        // 此处根据 less-loader 版本的不同会有不同的配置，详见 less-loader 官方文档
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { "@primary-color": "#1DA57A" },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
