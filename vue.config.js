module.exports = {
    pluginOptions: {
        nodeIntegration: true,
        electronBuilder: {
            nodeIntegration: true,
            preload: 'src/preload.js',
            builderOptions: {
              win: {
                icon: './public/icons/win/icon.ico'
              },
              mac: {
                icon: './public/icons/mac/icon.icns'
              },
              linux: {
                icon: './public/icons/png'
              },
            }
        }
    }
}