<template>
    <div class="results" ref="resultsArea">
        <div class="result"
            v-for="res in resultsData"
            :key="res.mp3_url"
            @dragstart.prevent="if(res.downloaded) startDrag(res.localPath);"
            draggable="true">
            <img :src="res.profile_pic" class="profile-picture-large">
            <div class="play-btn icon-btn" @click="playResult(res)">
                <vue-feather type="play" size="18"/>
            </div>
            <div class="info-audio">
                <div class="audio-desc">
                    <div ref="LoopName" class="desc-title">{{res.title}}</div>
                    <div ref="ArtistName" class="desc-artist">{{res.author}}</div>
                </div>
            </div>
            <img class="visualizer" :src="res.waveform" draggable="false">
            <div class="mono-value secondary">{{res.duration}}</div>
            <div class="mono-value" style="width: 69px;">{{res.key}}</div>
            <div class="mono-value">{{res.tempo}}</div>
            <div class="actions-result">
                <vue-feather type="trash-2"
                    size="18"
                    v-if="res.downloaded"
                    class="icon-btn"
                    @click="remove(res.localPath).then(res.downloaded = false)"
                />
                <div class="icon-spacer" v-else/>
                <vue-feather type="folder"
                    size="18"
                    v-if="res.downloaded"
                    class="icon-btn"
                    @click="revealFile(res.localPath)"
                />
                <vue-feather
                    type="download"
                    size="18"
                    v-else
                    class="icon-btn"
                    @click="download(res.mp3_url, res.localPath).then(res.downloaded = true)"
                />
                <vue-feather
                    type="heart"
                    size="18"
                    id="like"
                    v-bind:class="[{liked: false}, 'like', 'icon-btn']"
                />
                <vue-feather
                    type="link"
                    size="18"
                    class="icon-btn"
                    @click="openLink(res.web_link)"
                />
            </div>
        </div>
    </div>
    <VueEternalLoading :load="load" v-model:is-initial="isInitial">
        <!-- TODO: Add a fancy loading indicator -->
    </VueEternalLoading>
</template>

<script>
    import VueFeather from 'vue-feather';
    const electron = window.require("electron");
    import { VueEternalLoading } from '@ts-pro/vue-eternal-loading';

    export default {
        components: {
            VueFeather,
            VueEternalLoading
        },
        name: 'Results',
        data() {
            return {
                resultsData: [],
                query: {
                    category:       'loops',
                    keys:           '',
                    order:          ['date', 'd'],
                    tempo:          [0,200],
                    page:           1,
                    key:            ['c', ''],
                    date:           0,
                    genre:          0,
                    filterByKey:    false
                },
                isInitial: false
            };
        },
        methods: {
            load( {loaded} ) {
                electron.ipcRenderer.invoke("search", {
                    category:       this.query.category,
                    keys:           this.query.keys,
                    order:          [this.query.order[0],this.query.order[1]],
                    tempo:          [this.query.tempo[0],this.query.tempo[1]],
                    page:           this.query.page,
                    key:            [this.query.key[0], this.query.key[1]],
                    date:           this.query.date,
                    genre:          this.query.genre,
                    filterByKey:    this.query.filterByKey
                }).then(res => {
                    // if(res.length < 0){
                    //     return;
                    // }
                    res.forEach((r)=>{
                        r.filename = r.mp3_url.split("/").splice(-1)[0].split("?")[0];
            
                        r.localPath = "loops/"
                            + r.category.toLowerCase() + '/'
                            + r.tempo.replace(' ', '_') + '_'
                            + (r.key !="Unknown" ? r.key.toLowerCase() + '_' : '')
                            + r.filename;

                        let oldKey = r.key;
                        if(oldKey == "Unknown"){
                            r.key = "Unknown";
                        } else {
                            r.key = oldKey[0] + (oldKey[1] == "#" ? "#" : " ");
                            if(oldKey.substring(-1) == "m"){
                                r.key += " Minor";
                            }else{
                                r.key += " Major";
                            }
                        }

                        if(r.tempo[2].match(/\d+/g) == null){
                            r.tempo = " " + r.tempo;
                        }

                        electron.ipcRenderer.invoke("fileExists", r.localPath).then((exists)=>{
                            r.downloaded = exists;
                            this.addResult(r);
                        })
                    });    
                    loaded(res.length, 10);
                    this.query.page++;
                });
            },
            reset(){
                this.resultsData = []
                this.isInitial = true;
            },
            addResult(res){
                this.resultsData.push(res);
            },
            openLink(link){
                electron.ipcRenderer.invoke('openLink', link);
            },
            async download(mp3_url, localPath){
                return new Promise((resolve) => {
                    electron.ipcRenderer.invoke('downloadMP3', {
                        url: mp3_url,
                        dest: localPath
                    }).then(()=>{
                        resolve()
                    });
                });
            },
            async remove(localPath){
                return new Promise((resolve) => {
                    electron.ipcRenderer.invoke('fileDelete', localPath).then(()=>{
                        resolve()
                    });
                });
            },
            revealFile(path){
                electron.ipcRenderer.invoke('revealFile', path);
            },
            startDrag(path){
                electron.ipcRenderer.send('ondragstart', path);
            },
            playResult(res){
                let playbar = this.$parent.$parent.$refs.PlayBar;
                playbar.loadSample(res);
            }
        },
    }
</script>

<style lang="scss">
    @import "../styles/globals.scss";
    .result{
        width: calc(100% - $side-padding * 2);
        max-width: $max-content-width;
        display: flex;
        margin: auto;
        margin-bottom: $item-gap / 2;
        margin-top: $item-gap / 2;
        padding: $item-gap / 2;
        gap: $item-gap;
        height: 52px;
        align-items: center;
        border-radius: $radius;
        .info-audio{
            @include side-gradient(to right, $window-background);
            flex-grow: 2;
        }
        &:hover{
            background-color: $window-hover;
            .info-audio{
                @include side-gradient(to right, $window-hover);
            }
            .play-btn{
                opacity: 1;
                background-color: rgba($background-300,.5);
            }
        }
        .audio-desc{
            margin-left: 0;
        }
        .actions-result{
            width: 125px - $item-gap;
            display: flex;
            justify-content: space-between;
        }
    }
    .profile-picture-large{
        width: 52px;
        border-radius: $radius;
    }
    .visualizer{
        height: 100%;
        width: 100px;
        flex-shrink: 1;
        flex-grow: 1;
        background: #000;
        filter: invert(1);
        mix-blend-mode: lighten;
        opacity: .5;
    }
    .icon-spacer{
        width: 18px;
    }
    .like{
        &.liked svg{
            fill: $accent-1;
            stroke: $accent-1;
            &:hover{
                fill: rgba($accent-1, .3);
                stroke: $accent-1;
            }
            &:active{
                fill: rgba($accent-1, .5);
                stroke: $accent-1;
            }
        }
    }
    .play-btn{
        width: 52px;
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: -52px - $item-gap;
        opacity: 0;
        background-color: $background-300;
        svg{
            stroke: $foreground-100;
        }
        border-radius: $radius;
        transition-duration: $animation-duration;
        transition-timing-function: $animation-timing;
        backdrop-filter: blur(8px);
    }
</style>