const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');

var request = require('request');
const cheerio = require('cheerio');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1000,
        height: 600,
        webPreferences: {
            preload: path.join(app.getAppPath(), 'preload.js')
        }
    });
    win.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', ()=>{
        if(BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', ()=>{
    if(process.platform !== 'darwin') app.quit();
});

function search(args){
    return new Promise(reply => {
        results = [];
        key = args.filterByKey ? ("&mkey="+args.key[0]+args.key[1]) : "";
        request({
            url: 'https://looperman.com/' + args.category
                + '?page='+ args.page
                + '&keys=' + args.keys
                + '&order=' + args.order[0]
                + "&dir="+args.order[1]
                + key
                + "&ftempo="+args.tempo[0]
                + "&ttempo="+args.tempo[1],
            timeout: 60000
        }, function (err, res, body) {
            const $ = cheerio.load(res.body);
            $('#body-left .player-wrapper').each(function(i, elm) {
                results.push({
                    title: $(this).find(".player-title").text(),
                    author: $(this).find(".icon-user").text(),
                    profile_pic: $(this).find(".player-avatar a img").prop("src"),
                    waveform: $(this).find(".player-waveform-image").prop("src"),
                });
            });
            $('#body-left .tag-wrapper').each(function(i, elm) {
                results[i].tempo = $($(this).find("a")[0]).text();
                results[i].key = $($(this).find("a")[5]).text().slice(6);
            });
            reply(results);
        });
    });
}

ipcMain.handle('search', async (event, args) => {
    return await search(args);
})