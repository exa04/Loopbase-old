const {app, BrowserWindow, ipcMain, shell} = require('electron');

const path = require('path');
const os = require('os');
const fs = require('fs');

var request = require('request');
const cheerio = require('cheerio');

const pref = {
    dir : {
        content:        os.homedir() + "/loopbaseContent"
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
        var file = fs.createWriteStream(dest);
        var dir = path.dirname(dest);

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }
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
                    mp3_url: $(this).prop("rel"),
                    author: $(this).find(".icon-user").text(),
                    profile_pic: $(this).find(".player-avatar a img").prop("src"),
                    waveform: $(this).find(".player-waveform-image").prop("src"),
                    web_link: $(this).find(".player-top > a").prop("href")
                });
            });
            $('#body-left .tag-wrapper').each(function(i, elm) {
                results[i].tempo = $($(this).find("a")[0]).text();
                results[i].genre = $($(this).find("a")[1]).text().slice(0, -6);
                results[i].category = $($(this).find("a")[2]).text().slice(0, -6);
                results[i].key = $($(this).find("a")[5]).text().slice(6);
            });
            reply(results);
        });
    });
}

async function fileExists(path){
    return new Promise((resolve, reject) => {
        if(fs.existsSync(path)) resolve(true);
        else resolve(false);
    })
}

async function fileDelete(path){
    return new Promise((resolve, reject) => {
        try {
            fs.unlinkSync(path);
            resolve();
        } catch (err) {
            reject(err);
        }
    })
}

ipcMain.handle('search', async (event, args) => {
    return await search(args);
});

ipcMain.handle('downloadMP3', async (event, args) => {
    return await downloadMP3(args.url, pref.dir.content + "/" + args.dest);
});

ipcMain.handle('getDir', async (event, dir) => {
    return pref.dir[dir];
});

ipcMain.handle('fileExists', async (event, path) =>{
    return await fileExists(pref.dir.content + "/" + path);
});

ipcMain.handle('fileDelete', async (event, path) =>{
    return await fileDelete(pref.dir.content + "/" + path);
});

ipcMain.handle('openLink', async (event, url) =>{
    shell.openExternal(url);
});

ipcMain.on('ondragstart', (event, filePath) => {
    event.sender.startDrag({
      file: path.join(pref.dir.content, filePath),
      icon: path.join(__dirname, 'img/dragAndDrop.png')
    });
});