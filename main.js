const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const tmp = require('tmp');
tmp.setGracefulCleanup();
const os = require('os');
const fs = require('fs');

var request = require('request');
const cheerio = require('cheerio');

const pref = {
    dir : {
        content:        os.homedir() + "/loopermanContent",
        loops:          os.homedir() + "/loopermanContent/loops"
    }
}

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

async function downloadMP3(url, dest){
    return new Promise((resolve, reject) => {
        let file = fs.createWriteStream(dest); 
        let stream = request({
            uri: url,
            timeout: 60000
        })
        .pipe(file)
        .on('finish', () => {
            resolve();
        })
        .on('error', (error) => {
            reject(error);
        })
    })
}

async function tmpMp3(url){
    return new Promise((resolve, reject) => {
        tmp.file({ prefix: 'preview_', postfix: '.mp3' }, function _tempFileCreated(error, filepath, fd, cleanupCallback) {
            if (error) reject(error);
            downloadMP3(url, filepath);
            resolve(filepath);
        });
    });
}

function search(args){
    return new Promise(reply => {
        results = [];
        key = args.filterByKey ? ("&mkey="+args.key[0]+args.key[1]) : "";
        var date = args.date == 0 ? '' : '&when=' + args.date;
        var genre = args.genre == 0 ? '' : '&gid=' + args.genre;
        request({
            url: 'https://looperman.com/' + args.category
                + '?page='+ args.page
                + '&keys=' + args.keys
                + '&order=' + args.order[0]
                + date
                + genre
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

ipcMain.handle('tempMP3', async (event, args) => {
    return await tmpMp3('https://www.looperman.com/media/loops/4698955/looperman-l-4698955-0270695-808bass-a-bpm183.mp3');
})