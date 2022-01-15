<template>
    <div ref="PlayBar" class="play-bar" v-bind:class="{hidden: title == ''}">
        <audio
            id="audioPlayer"
            ref="audioPlayer"
            :loop="loop"
            :volume="volume / 100"
            @timeupdate="setPlaybackPos()"
        />
        <div ref="InfoArea" class="info-audio">
            <img ref="ProfilePicture" :src="profile_picture" class="profile-picture">
            <div class="audio-desc">
                <div ref="LoopName" class="desc-title">{{title}}</div>
                <div ref="ArtistName" class="desc-artist">{{info}}</div>
            </div>
        </div>
        <div class="playback-controls">
            <vue-feather class="icon-btn" type="skip-back" size="18"></vue-feather>
            <vue-feather
                class="icon-btn"
                :type="this.$refs.audioPlayer.paused ? 'play' : 'pause'"
                size="18"
                @click="togglePlay()"
            />
            <vue-feather class="icon-btn" type="skip-forward" size="18"></vue-feather>
        </div>
        <Slider
            :tooltips="false"
            id="playbackSlider"
            ref="playbackSlider"
            :min="0"
            v-model="position"
            :step="0.001"
            :max="1"
        />
        <vue-feather
            class="icon-btn"
            type="volume-x"
            size="18"
            v-if="volume==0"
            @click="volume = prevVolume"
        />
        <div v-else @click="prevVolume = volume; volume = 0" style="height: 18px">
            <vue-feather class="icon-btn" type="volume" size="18" v-if="volume < 33"></vue-feather>
            <vue-feather class="icon-btn" type="volume-1" size="18" v-else-if="volume < 67"></vue-feather>
            <vue-feather class="icon-btn" type="volume-2" size="18" v-else-if="volume >= 67"></vue-feather>
        </div>
        <Slider
            v-model="volume"
            showTooltip="drag"
            id="volumeSlider"
            :lazy="false"
            :min="0"
            :step="1"
            :max="100"
        />
    </div>
</template>

<script>
    import VueFeather from 'vue-feather';
    import Slider from '@vueform/slider';

    export default {
        name:'PlayBar',
        components: {
            VueFeather,
            Slider
        },
        props: {
        },
        methods: {
            loadSample(res){
                console.log("???");
                this.$data.title = res.title;
                this.$data.info = res.author + " | " + res.tempo + " | " + res.key;
                this.$data.profile_picture = res.profile_pic;

                let audio = document.getElementById("audioPlayer");
                if(audio == undefined) return;
                if(res.mp3_url == audio.src){
                    if(audio.currentTime == audio.duration){
                        audio.currentTime=0;
                    }
                    if (audio.paused) {
                        audio.play();
                    } else {
                        audio.pause();
                    }
                    return;
                }
                audio.src = res.mp3_url;
                audio.play();
            },
            togglePlay(){
                let audio = document.getElementById("audioPlayer");
                if(audio == undefined) return;
                if (audio.paused) {
                    audio.play();
                } else {
                    audio.pause();
                }
            },
            getPlaybackPos(){
                let audio = document.getElementById("audioPlayer");
                if(audio == undefined) return 0;
                return audio.currentTime / audio.duration;
            },
            setPlaybackPos(){
                let audio = document.getElementById("audioPlayer");
                if(audio == undefined) return 0;
                    this.$data.position = audio.currentTime / audio.duration;
            },
            getDuration(){
                let audio = document.getElementById("audioPlayer");
                if(audio == undefined) return 0;
                return audio.duration;
            },
            // positionToAudio(){
            //     let audio = document.getElementById("audioPlayer");
            //     if(audio == undefined) return 0;
            //     setTimeout(audio.currentTime = audio.duration * this.$data.position, 10);
            // }
        },
        data() {
            return {
                position: 0,
                volumePercent: 100,
                loop: false,
                title: "",
                info: "",
                profile_picture: "",
                volume: 100,
                prevVolume: 100
            }
        }
    }
</script>

<style lang="scss">
    @import "../styles/globals.scss";
    @import "@vueform/slider/themes/default.scss";

    .play-bar{
        background-color: $playbar-background;
        padding: 0 $side-padding;
        gap: $side-padding;
        height: 90px;
        align-items: center;
        display: flex;
        border-top: 1px solid $seperator;
        &.hidden{
            display: none;
        }
    }
    .info-audio{
        display: flex;
        align-items: center;
        flex-grow: 2;
        height: 100%;
        @include side-gradient(to right, $playbar-background);
    }
    .profile-picture{
        width: 36px;
        image-rendering: crisp-edges;
        border-radius: $radius;
    }
    .audio-desc{
        margin-left: $item-gap / 2;
        div{
            width: max-content;
        }
        overflow: hidden;
        width: 10px;
        flex-grow: 1;
    }
    .playback-controls{
        display: flex;
        gap: $item-gap;
        align-items: center;
    }
    #volumeSlider{
        width: 120px;
    }
    #playbackSlider{
        flex-grow: 2;
    }
</style>