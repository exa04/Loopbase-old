let query = {
    category:       'loops',
    keys:           '',
    order:          ['date', 'd'],
    tempo:          [0,200],
    page:           1,
    key:            ['c', ''],
    date:           0,
    genre:          0,
    filterByKey:    false
};

var searchSession = {
    tempoRange: true,
    appendContent: false,
    direction: "d"
};

var tempoSlider = new rSlider({
    target: '#tempo-range',
    values: {min: 0, max: 200},
    step: 1,
    range: searchSession.tempoRange,
    tooltip: true,
    scale: false,
    labels: false,
    set: [0, 200]
});

var loadedPreviewContent = {}
var audioPreviewPlayer = new Audio();
audioPreviewPlayer.volume = 1;
audioPreviewPlayer.pause()
var currentCtxMenu;


search(false);
feather.replace();

document.querySelector("#direction-toggle").firstElementChild.style.display = "none";
// document.getElementById("volume-icon").querySelector(".feather-volume").style.display = "none";
// document.getElementById("volume-icon").querySelector(".feather-volume-1").style.display = "none";

function toggleTempoSliderMode(){
    let min = [parseInt(tempoSlider.getValue().split(/[ ,]+/)[0]), 200];
    
    searchSession.tempoRange = !searchSession.tempoRange;

    document.getElementById("tempo-mode-toggle").innerHTML = searchSession.tempoRange ? "BPM Range" : "Single BPM"

    tempoSlider.destroy();
    tempoSlider = new rSlider({
        target: '#tempo-range',
        values: {min: 0, max: 200},
        step: 1,
        range: searchSession.tempoRange,
        tooltip: true,
        scale: false,
        labels: false,
        set: min
    });
}

function toggleKeyMode(){
    query.key[1] = (query.key[1] == "m") ? "" : "m";
    document.getElementById("key-mode-toggle").innerHTML = (query.key[1] == "m") ? "Minor Key" : "Major Key";
}

function toggleDirection(){
    if(searchSession.direction == "d"){
        searchSession.direction = "a";
        document.querySelector("#direction-toggle .feather-chevrons-down").style.display = "none";
        document.querySelector("#direction-toggle .feather-chevrons-up").style.display = "inline";
    } else {
        searchSession.direction = "d";
        document.querySelector("#direction-toggle .feather-chevrons-down").style.display = "inline";
        document.querySelector("#direction-toggle .feather-chevrons-up").style.display = "none";
    }
}

function ctxMenuHTML(web_link, exists, localSampleFilePath){
    if(!exists){
        var actions_ctx = ``;
    } else {
        var actions_ctx =  
        `<a onclick='deleteFile("`+localSampleFilePath+`", this)'>
            `+ feather.icons[`trash`].toSvg() + `
            <span>Delete</span>
        </a>`;
    }

    return `
                <a onclick='openBrowser("`+web_link+`"); hideCtxMenu();'>` + feather.icons[`link`].toSvg() + `<span>View in browser</span></a>
                `+actions_ctx+`
                <a onclick='hideCtxMenu()'>` + feather.icons[`x`].toSvg() + `</a>
            `
}

function appendResults(results){
    resultsContainer = document.querySelector("#results-contents");
    results.forEach(result => {
        // Removes everything before the last slash, as
        // well as everything after the last question mark
        var filename = result.mp3_url.split("/").splice(-1)[0].split("?")[0];

        localSampleFilePath = "loops/"
                                + result.category.toLowerCase() + '/'
                                + result.tempo.replace(' ', '_') + '_'
                                + (result.key != "Unknown" ? result.key.toLowerCase() + '_' : '')
                                + filename;
        ipcRenderer.invoke('fileExists', localSampleFilePath).then((exists) => {
            var filename = result.mp3_url.split("/").splice(-1)[0].split("?")[0];
            localSampleFilePath = "loops/"
                                    + result.category.toLowerCase() + '/'
                                    + result.tempo.replace(' ', '_') + '_'
                                    + (result.key !="Unknown" ? result.key.toLowerCase() + '_' : '')
                                    + filename;

            if(!exists){
                var action_1 =
                `<a onclick='downloadResult("`+result.mp3_url+`","`+localSampleFilePath+`", this)'>
                    ` + feather.icons[`download-cloud`].toSvg() + `
                </a>`;
            } else {
                var action_1 =
                `<a ondragstart="event.preventDefault(); startDrag('`+localSampleFilePath+`');" draggable="true"'>
                    ` + feather.icons[`copy`].toSvg() + `
                </a>`;
            }

            html = `
            <div class='audio-result `+(exists ? `downloaded` : ``)+`'>
                <div class='fg-layer'>
                    <div class='info'>
                        <div class='pp-area' onclick='preview("`+result.mp3_url+`")' id='`+result.mp3_url+`'>
                            <img src='`+result.profile_pic+`' class='profile_picture_sample'>
                            <div class='pp-playbutton'>`+feather.icons[`play`].toSvg()+feather.icons[`pause`].toSvg()+`</div>
                        </div>
                        <div class='sample-info-txt'>
                            <div class='sample-title'>`+result.title+`</div>
                            <div class='sample-author'>`+result.author+` - `+result.tempo+` - Key: `+result.key+`</div>
                        </div>
                    </div>
                    <div class='actions'>
                        `+action_1+`
                        <a onclick='showCtxMenu(this.parentElement.querySelector(".ctx-menu"))'>
                            `+feather.icons[`more-vertical`].toSvg()+`
                        </a>
                        <div class='ctx-menu' rel='`+result.web_link+`'>`+ctxMenuHTML(result.web_link, exists, localSampleFilePath)+`</div>
                    </div>
                </div>
                <div class='bg-layer'>
                    <img src='` + result.waveform + `' class='bg-waveform'></div>
                </div>
            </div>`;
            resultsContainer.innerHTML += html;
        });
    });
}

function showCtxMenu(el){
    try {
        currentCtxMenu.style.display = 'none';
    } catch (err) { }
    currentCtxMenu = el;
    currentCtxMenu.style.display = 'block';
}

function hideCtxMenu(el){
    currentCtxMenu.style.display = 'none';
}

function startDrag(path){
    ipcRenderer.invoke('getDir', 'loop').then(dir => {
        window.electron.startDrag(path);
    });
}

function openBrowser(url){
    ipcRenderer.invoke('openLink', url);
}

function search(setQuery){
    resultsContainer = document.querySelector("#results-contents");
    resultsContainer.innerHTML = '<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>';

    if(setQuery){
        let min = parseInt(tempoSlider.getValue().split(/[ ,]+/)[0]);
        let max = searchSession.tempoRange ? parseInt(tempoSlider.getValue().split(/[ ,]+/)[1]) : min;
        query.keys = document.querySelector("#filter-search").value;
        query.tempo = [min,max];
        query.page = 1;
        query.order[0] = document.querySelector("#order").value;
        query.order[1] = searchSession.direction;
        query.date = document.querySelector("#date").value;
        query.genre = document.querySelector("#genre").value;
    }

    ipcRenderer.invoke('search', query).then((results) => {
        resultsContainer.innerHTML = '';
        if(results.length > 0){
            appendResults(results);
            searchSession.appendContent = false;
        }
        else resultsContainer.innerHTML = '<p id="nothing-found">Nothing was found.</p>';
    });
}

function loadNewContent(){
    query.page += 1;

    ipcRenderer.invoke('search', query).then((results) => {
        resultsContainer.querySelector(".lds-ellipsis").remove();
        if(results.length > 0){
            searchSession.appendContent = false;
            appendResults(results);
        }
    });
}

function selectkey(key){
    document.querySelectorAll("#keys .key").forEach((el)=>{
        if(el.classList.contains("selected")) el.classList.remove("selected");
    });

    if(query.filterByKey && query.key[0] == key){
        document.querySelector('#keys #'+key).classList.remove("selected");
        query.filterByKey = false;
    } else {
        document.querySelector('#keys #'+key).classList.add("selected");
        query.filterByKey = true;
    }

    query.key[0] = key;
}

function toggleMute(){
    if(audioPreviewPlayer.volume == 0){
        volumeChange();
    }
    else{
        audioPreviewPlayer.volume = 0;
        document.getElementById("volume-icon").querySelector(".feather-volume").style.display = "none";
        document.getElementById("volume-icon").querySelector(".feather-volume-1").style.display = "none";
        document.getElementById("volume-icon").querySelector(".feather-volume-2").style.display = "none";
        document.getElementById("volume-icon").querySelector(".feather-volume-x").style.display = "block";
    }
}

function volumeChange(){
    var slider = document.getElementById("volume-slider");
    var volume = slider.value;
    var percentage = volume * 100;
    var originalColor = getComputedStyle(slider).background;
    var colorSlices = originalColor.split(" ");
    var color = colorSlices[4]+colorSlices[5]+colorSlices[6]+colorSlices[7]+' ' + percentage + '%, ' + colorSlices[9]+colorSlices[10]+colorSlices[11]+ percentage + '%)';
    console.log(originalColor);
    slider.style.background = color;
    audioPreviewPlayer.volume = volume;

    if(percentage == 0){
        document.getElementById("volume-icon").querySelector(".feather-volume").style.display = "block";
        document.getElementById("volume-icon").querySelector(".feather-volume-1").style.display = "none";
        document.getElementById("volume-icon").querySelector(".feather-volume-2").style.display = "none";
        document.getElementById("volume-icon").querySelector(".feather-volume-x").style.display = "none";
    }
    else if(percentage > 0 && percentage < 50){
        document.getElementById("volume-icon").querySelector(".feather-volume").style.display = "none";
        document.getElementById("volume-icon").querySelector(".feather-volume-1").style.display = "block";
        document.getElementById("volume-icon").querySelector(".feather-volume-2").style.display = "none";
        document.getElementById("volume-icon").querySelector(".feather-volume-x").style.display = "none";
    }
    else if(percentage >= 50){
        document.getElementById("volume-icon").querySelector(".feather-volume").style.display = "none";
        document.getElementById("volume-icon").querySelector(".feather-volume-1").style.display = "none";
        document.getElementById("volume-icon").querySelector(".feather-volume-2").style.display = "block";
        document.getElementById("volume-icon").querySelector(".feather-volume-x").style.display = "none";
    }
}

function preview(url){
    var oldUrl = audioPreviewPlayer.src;
    var volume = audioPreviewPlayer.volume;
    var playing = false;

    if(url != oldUrl){
        playing = true;
        audioPreviewPlayer.pause();
        audioPreviewPlayer = new Audio(url);
        audioPreviewPlayer.volume = volume;
        audioPreviewPlayer.play();
        document.getElementById(url);
    }else{
        if(audioPreviewPlayer.paused === false){
            playing = false;
            audioPreviewPlayer.pause();
        }else{
            playing = true;
            audioPreviewPlayer.play();
        }
    }
    try {
        document.getElementById(oldUrl).querySelector(".pp-playbutton").classList.remove("playing");
        document.getElementById(oldUrl).querySelector(".pp-playbutton").classList.remove("paused");
    } catch (error) {
        
    }
    document.getElementById(url).querySelector(".pp-playbutton").classList.add(playing ? "playing" : "paused");
}

function downloadResult(url, dest, el){
    ipcRenderer.invoke('downloadMP3', {url, dest}).then(() => {
        el.parentElement.parentElement.parentElement.classList.add("downloaded");
        el.setAttribute('ondragstart',`event.preventDefault(); startDrag('`+dest+`');`);
        el.setAttribute('draggable','true');
        el.setAttribute('onclick','');
        el.innerHTML = feather.icons[`copy`].toSvg();
        var web_link = el.parentElement.querySelector('.ctx-menu').getAttribute('rel');
        el.parentElement.querySelector('.ctx-menu').innerHTML = ctxMenuHTML(web_link,true,dest);
    });
}

function deleteFile(path, el){
    hideCtxMenu(el);
    ipcRenderer.invoke('fileDelete', path).then(() => {
        el.parentElement.parentElement.parentElement.parentElement.classList.remove("downloaded");
        mp3_url = el.parentElement.parentElement.parentElement.querySelector('.pp-area').id;
        var web_link = el.parentElement.getAttribute('rel');
        var mp3_url = el.parentElement.getAttribute('rel');
        el.parentElement.parentElement.querySelector('a').setAttribute('onclick',`downloadResult("`+mp3_url+`","`+path+`", this)`);
        el.parentElement.parentElement.querySelector('a').setAttribute('ondragstart','');
        el.parentElement.parentElement.querySelector('a').setAttribute('draggable','false');
        el.parentElement.parentElement.querySelector('a').innerHTML = feather.icons[`download-cloud`].toSvg();
        el.parentElement.innerHTML = ctxMenuHTML(web_link,false,path);
    });
}
var r = document.querySelector("#results");

r.onscroll = (ev) => {
    resultsContainer = document.querySelector("#results-contents");
    if (Math.ceil(r.scrollTop + r.clientHeight) >= r.scrollHeight - 200
    && !resultsContainer.lastElementChild.classList.contains("lds-ellipsis")) {
        if(!searchSession.appendContent){
            searchSession.appendContent = true;
            resultsContainer.innerHTML += '<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>';
            loadNewContent();
        }
    }
};