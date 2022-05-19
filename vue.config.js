const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  pluginOptions: {
    nodeIntegration: true,
    electronBuilder: {
      nodeIntegration: true,
      preload: "src/preload.js",
      builderOptions: {
        win: {
          icon: "./public/icons/win/icon.ico",
        },
        mac: {
          category: "public.app-category.music",
          icon: "./public/icons/mac/icon.icns",
        },
        linux: {
          icon: "./public/icons/png",
          category: "Audio",
        },
      },
    },
  },
});
